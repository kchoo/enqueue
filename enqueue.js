const sqs = new (require('aws-sdk').SQS)();

const $q = require('kchoo-q');

const sqsGetQueueUrlQ = $q.promisify(sqs.getQueueUrl, sqs);
const sqsSendMessageQ = $q.promisify(sqs.sendMessage, sqs);

const queuePrefix = 'kchoo-media-aggregator';

module.exports = function (name, ...userMessage) {
	return function (...sourceMessage) {
		return sqsGetQueueUrlQ({
				QueueName: `${queuePrefix}-${name}`
			}).
			then(function ({QueueUrl}) {
				return sqsSendMessageQ({
					MessageBody: JSON.stringify(userMessage.concat(sourceMessage)),
					QueueUrl
				});
			}).
			then(function () {
				return userMessage.concat(sourceMessage);
			});
	};
};
