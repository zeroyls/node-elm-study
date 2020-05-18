'use strict';

import EntryModel from '../../models/v2/entry';

class Entry {
    constructor(){

    }

    async getEntry(req, res, next){
        let responseData;
        try{
            const entries = await EntryModel.find({}, '-_id');
            responseData = {
                error_code: 0,
                error_type: 'ERROR_OK',
                entries
            }
        }catch(err ){
            responseData = {
                error_code: 4002,
                error_type: 'ENTRY_GET_ERROR',
            }
        };
        res.data = responseData;
        next();
    }
}

export default new Entry()