const AWS = require('aws-sdk')
const mediaConvert = new AWS.MediaConvert({
  endpoint: process.env.MEDIA_ENDPOINT,
})

const outputBucketName = process.env.TRANSCODED_VIDEO_BUCKET

exports.handler = async (event, context) => {
  const key = event.Records[0].s3.object.key
  const sourceKey = decodeURIComponent(key.replace(/\+/g, ' '))
  const outputKey = sourceKey.split('.')[0]

  const input =
    's3://' +
    event.Records[0].s3.bucket.name +
    '/' +
    event.Records[0].s3.object.key
  const output = 's3://' + outputBucketName + '/' + outputKey + '/'

  try {
    const job = {
      Role: process.env.MEDIA_ROLE,
      Settings: {
        Inputs: [
          {
            FileInput: input,
            AudioSelectors: {
              'Audio Selector 1': {
                SelectorType: 'TRACK',
                Tracks: [1],
              },
            },
          },
        ],
        OutputGroups: [
          {
            Name: 'File Group',
            Outputs: [
              {
                Preset:
                  'System-Generic_Hd_Mp4_Avc_Aac_16x9_1920x1080p_24Hz_6Mbps',
                Extension: 'mp4',
                NameModifier: '_16x9_1920x1080p_24Hz_6Mbps',
              },
              {
                Preset:
                  'System-Generic_Hd_Mp4_Avc_Aac_16x9_1280x720p_24Hz_4.5Mbps',
                Extension: 'mp4',
                NameModifier: '_16x9_1280x720p_24Hz_4.5Mbps',
              },
              {
                Preset:
                  'System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps',
                Extension: 'mp4',
                NameModifier: '_4x3_640x480p_24Hz_1.5Mbps',
              },
            ],
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: output,
              },
            },
          },
        ],
      },
    }

    const mediaConvertResult = await mediaConvert.createJob(job).promise()
    console.log(mediaConvertResult)
    return mediaConvertResult
  } catch (error) {
    console.error(error)
  }
}
