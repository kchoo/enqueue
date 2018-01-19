const sqs = new (require('aws-sdk').SQS)();

const $q = require('kchoo-q');

const sqsGetQueueUrlQ = $q.promisify(sqs.getQueueUrl, sqs);
const sqsSendMessageQ = $q.promisify(sqs.sendMessage, sqs);

const queuePrefix = 'kchoo-media-aggregator';

module.exports = function (success, name, ...message) {
	return function (...error) {
		return sqsGetQueueUrlQ({
				QueueName: `${queuePrefix}-${name}`
			}).
			then(function ({QueueUrl}) {
				return sqsSendMessageQ({
					MessageBody: JSON.stringify(message.concat(error)),
					QueueUrl
				});
			}).
			then(function () {
				if (!success) {
					throw message;
				}
			});
	};
};
