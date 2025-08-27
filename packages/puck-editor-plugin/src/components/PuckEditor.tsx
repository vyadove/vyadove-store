"use client";

import { Puck } from "@measured/puck";
import { useField, useForm } from "@payloadcms/ui";
import "@measured/puck/puck.css";
import { clientConfig } from "../config/client-config";
import "./PuckEditor.scss";

const initialData = {};

export const PuckEditor = () => {
    const { value, setValue } = useField<any>({ path: "page" });
    const { value: title, setValue: setTitle } = useField<any>({
        path: "title",
    });
    const { value: handle, setValue: setHandle } = useField<any>({
        path: "handle",
    });
    const { submit } = useForm();
    const save = () => {
        submit();
    };
    const onChange = (data: any) => {
        setValue(data);
        if (data.root?.props?.title !== title) {
            setTitle(data.root?.props?.title);
        }
        if (data.root?.props?.handle !== handle) {
            setHandle(data.root?.props?.handle);
        }
    };
    return (
        <Puck
            config={clientConfig}
            data={value || initialData}
            onPublish={save}
            onChange={onChange}
            overrides={{
                headerActions: ({ children }) => (
                    <>
                        {/* <Button buttonStyle="secondary">View page</Button>
                        <Button onClick={save} buttonStyle="primary">
                            <Globe size={12} />
                            Publish
                        </Button> */}
                    </>
                ),
            }}
        />
    );
};
