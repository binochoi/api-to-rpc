import { RPCContext, RPCContextOutput } from './types';
import { recurseSegments } from './services/recurseSegments';
import { RecurseApiDeep } from 'src/types';

const rpc = <Tapi extends object>(context: RPCContext): RecurseApiDeep<Tapi> => {
    context.onRequest ||= (params, fetcher) => fetcher(params);
    context.onResponse ||= (data) => data;
    return recurseSegments({
        startPath: context.baseURL,
        context: context as RPCContextOutput,
    });
}
export default rpc;