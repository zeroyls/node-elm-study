
'use strict';

import v1 from './v1.js';

export default app => {
    app.use('/v1', v1);//记得要添加前面的斜杠
}