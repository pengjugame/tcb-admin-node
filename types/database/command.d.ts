import { QueryCommmand } from './commands/query';
import { LogicCommand } from './commands/logic';
import { UpdateCommand } from './commands/update';
export declare type IQueryCondition = Record<string, any> | LogicCommand;
export declare const Command: {
    eq(val: any): QueryCommmand;
    neq(val: any): QueryCommmand;
    lt(val: any): QueryCommmand;
    lte(val: any): QueryCommmand;
    gt(val: any): QueryCommmand;
    gte(val: any): QueryCommmand;
    in(val: any): QueryCommmand;
    nin(val: any): QueryCommmand;
    and(...__expressions__: import("../../../../../../Users/jimmyzhang/repo/tcb-admin-node/src/database/serializer/query").IQueryCondition[]): LogicCommand;
    or(...__expressions__: import("../../../../../../Users/jimmyzhang/repo/tcb-admin-node/src/database/serializer/query").IQueryCondition[]): LogicCommand;
    set(val: any): UpdateCommand;
    remove(): UpdateCommand;
    inc(val: number): UpdateCommand;
    mul(val: number): UpdateCommand;
    push(...__values__: any[]): UpdateCommand;
    pop(): UpdateCommand;
    shift(): UpdateCommand;
    unshift(...__values__: any[]): UpdateCommand;
};
export default Command;
