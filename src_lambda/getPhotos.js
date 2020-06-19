const AWS = require('aws-sdk');
const { values } = require('underscore');
const dynamodb = new AWS.DynamoDB({ region: 'eu-central-1', apiVersion: '2012-08-10' });

const callback = ( msg, values="") => {
    console.log(msg)
    console.log(values)
}

const getItems = (groupid, callback) => {
    if (typeof groupid !== 'undefined') {

        const params = {
            TableName: 'photos',
            KeyConditionExpression: "GroupId = :g", // and OwnerId = :o",
            ExpressionAttributeValues: {
                ":g": { S: "" + groupid }
                // ":o" : { S:"andre" }
            }
        };

        dynamodb.query(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(data);
                const items = data.Items.map(
                    (dataField) => {
                        return { x: +dataField.X.S, y: +dataField.Y.S };
                    }
                );
                callback(null, items);
            }
        });

    } else {
        callback('Something went wrong!');
    }
}

getItems(2, callback)