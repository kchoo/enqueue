const sqs = new (require('aws-sdk').SQS)(require('../config.json').aws);

const $q = require('kchoo-q');

const sqsGetQueueUrlQ = $q.promisify(sqs.getQueueUrl, sqs);
const sqsSendMessageQ = $q.promisify(sqs.sendMessage, sqs);
const sqsCreateQueueQ = $q.promisify(sqs.createQueue, sqs);

const queuePrefix = 'kchoo-media-aggregator';

module.exports = function (success, name, ...message) {
	return function (...error) {
		const fullMessage = message.concat(error);
		const QueueName = `${queuePrefix}-${name}`;
		return sqsGetQueueUrlQ({QueueName}).
			catch(function (res) {
				if (res.code === 'AWS.SimpleQueueService.NonExistentQueue') {
					return sqsCreateQueueQ({QueueName});
				}
				throw res;
			}).
			then(function ({QueueUrl}) {
				return sqsSendMessageQ({
					MessageBody: JSON.stringify(fullMessage),
					QueueUrl
				});
			}).
			then(function () {
				if (!success) {
					throw new Error(fullMessage);
				}
			});
	};
};
