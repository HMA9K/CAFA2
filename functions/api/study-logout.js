import catalog from '../../assistant/server/catalog.generated.mjs';
import {handle} from '../../assistant/server/handler.mjs';
export const onRequest = context => handle(context,catalog);
