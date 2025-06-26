import type {
    PayloadRequest,
    RequestContext,
    SanitizedCollectionConfig,
    TypeWithID,
} from "payload";

export type AfterChangeHook<T extends TypeWithID = any> = (args: {
    /** The collection which this hook is being run on */
    collection: SanitizedCollectionConfig;
    context: RequestContext;
    doc: T;
    /**
     * Hook operation being performed
     */
    operation: "create" | "update";
    previousDoc: T;
    req: PayloadRequest;
}) => any;

export type BeforeChangeHook<T extends TypeWithID = any> = (args: {
    /** The collection which this hook is being run on */
    collection: SanitizedCollectionConfig;
    context: RequestContext;
    data: Partial<T>;
    /**
     * Hook operation being performed
     */
    operation: "create" | "update";
    /**
     * Original document before change
     *
     * `undefined` on 'create' operation
     */
    originalDoc?: T;
    req: PayloadRequest;
}) => any;
