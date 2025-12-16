"use client";

import React, { useEffect, useState } from "react";
import { SelectInput, useField } from "@payloadcms/ui";
import {
    ReactSelect,
    RelationshipField,
    RelationshipInput,
} from "@payloadcms/ui";

// {
//     field: {
//         name: 'category',
//             relationTo: 'category',
//             type: 'relationship',
//             admin: { position: 'sidebar' },
//         hasMany: true,
//             label: 'Category',
//             index: true
//     },
//     path: 'category',
//         permissions: true,
//     readOnly: false,
//     schemaPath: 'products.category'
// }

type Props = {};

const CategoryTreeSelect = (props: any) => {
    const { path, field } = props;
    const { value, setValue } = useField({ path });

    const [options, setOptions] = useState([]);

    console.log("prosp -----   :", props);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("/api/category?limit=100");
            const data = await res.json();

            const tree = buildCategoryTree(data.docs);
            const flatOptions = flattenCategoryTree(tree);
            setOptions(flatOptions);
        };

        fetchCategories();
    }, []);

    return (
        <div
            className="flex flex-col gap-3 border-2"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            <RelationshipField path={path} field={field} />

            {/*<ReactSelect
                value={options.find((opt: any) => opt.value === value) || null}
                options={options}
                onChange={(selected) => setValue(selected?.value || null)}
                isClearable
                placeholder="Select Category"
            />*/}
        </div>
    );
};

// helper: build nested tree
function buildCategoryTree(categories: any[]) {
    const map: any = {};
    categories.forEach((c: any) => (map[c.id] = { ...c, children: [] }));
    const tree = [];
    for (const cat_ of Object.values(map)) {
        // todo: avoid this any cast
        const cat: any = cat_;
        if (cat.parent) map[cat.parent.id].children.push(cat);
        else tree.push(cat);
    }
    return tree;
}

// helper: flatten tree with path labels
function flattenCategoryTree(tree: any, prefix = "") {
    return tree.flatMap((node: any) => {
        const label = prefix ? `${prefix} / ${node.title}` : node.title;
        const current = [{ label, value: node.id }];
        const children = flattenCategoryTree(node.children, label);
        return [...current, ...children];
    });
}

export default CategoryTreeSelect;
