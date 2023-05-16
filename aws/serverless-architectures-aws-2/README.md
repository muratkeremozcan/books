```bash
# needs node 14
nvm use
npm i # may need force

# configure credentials (needed for deploy and e2e tests)
npm run sls -- config credentials --provider aws --key <yourAWSAccessKeyId> --secret <AWSSecretKey> --overwrite

# deploy
npm run deploy

```

### To test the function

1. Go to the S3 console.
2. Click into your upload bucket and then select Upload to open the Upload page
3. Click Add Files, select a video file from your computer, and click the Upload
   button. All other settings can be left as is. If you don’t have any video
   files to test, go to https://sample-videos.com and grab one of the MP4
   videos.
4. After a time, you should see three new videos in your transcoded video
   bucket.

### What happens?

1. Upload new video file to upload-video-bucket-mko
2. `transcode-video` lambda gets triggered, and creates a transcode job
3. The output of the transcode job is uploaded to the transcode-bucket-mko
