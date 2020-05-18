
'use strict';

import v1 from './v1';
import v2 from './v2';
import admin from './admin';
import shopping from './shopping';

export default app => {
    app.use('/v1', v1);//记得要添加前面的斜杠
    app.use('/admin', admin);
    app.use('/v2', v2);
    app.use('/shopping', shopping);
}