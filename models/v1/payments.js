'use strict';

import mongoose from 'mongoose'
import paymentsData from '../../InitData/payments'

const Schema = mongoose.Schema;

const paymentsSchema = new Schema({
	description: String,
	disabled_reason: String,
	id: Number,
	is_online_payment: Boolean,
	name: String,
	promotion: [],
	select_state: Number,
})

const PaymentsModel = mongoose.model('Payments', paymentsSchema);

PaymentsModel.findOne((err, data) => {
	if (!data) {
		paymentsData.forEach(item => {
			PaymentsModel.create(item);
		})
	}
})	


export default PaymentsModel