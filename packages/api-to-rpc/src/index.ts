import { RPCOptions } from './types';
import { recurseSegments } from './services/recurseSegments';
import { RecurseApiDeep } from 'src/types';

const rpc = <Tapi extends object>(options: RPCOptions): RecurseApiDeep<Tapi> => {
    return recurseSegments({
        startPath: options.baseURL,
    });
}
export default rpc;