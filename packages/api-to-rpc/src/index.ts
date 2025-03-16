import { $fetch } from 'ofetch';
import { RPCOptions, RPCResult } from './types';
import { recurseSegments } from './services/recurseSegments';
import { RecurseApiDeep } from 'src/types';

const createFetch = (fullPath: string) => $fetch.create({
    baseURL: 'https://api.example.com',
})
const rpc = <Tapi extends object>(options: RPCOptions): RecurseApiDeep<Tapi> => {
    
    return recurseSegments('/api', options);
}
export default rpc;