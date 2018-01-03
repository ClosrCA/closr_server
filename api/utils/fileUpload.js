var AWS = require('aws-sdk');

module.exports = {
    uploadImageToAWS: function(file, fileName, callback) {
        AWS.config.update({
            accessKeyId:"AKIAIGMZYILI3RZMV5IA",
            secretAccessKey:"mXkjMCz6XLEdgl0NGXOojfen1VeL2SWN7+0s3amG"
        });

        var bucket = new AWS.S3({apiVersion:'2006-03-01'});
        var uploadParams = {
            Bucket:'yourtable-avatars',
            Key: fileName,
            Body: file.buffer.toString()
        };

        bucket.upload(uploadParams, callback);
    }
};