# Adding Videos to the Vault

Videos in the Vault are handled differently than images because Sanity's image field doesn't support video files natively.

## **Two Options for Videos:**

### **Option 1: Use Cloudinary (Recommended)**

1. **Upload your video to Cloudinary**
   - Go to https://cloudinary.com/console
   - Upload your video file
   - **IMPORTANT:** Copy the **public ID** (e.g., `Golden_BullCoin_jthgvt`), NOT the embed player URL
   - OR copy the direct video URL (it will look like: `https://res.cloudinary.com/basecreator/video/upload/v1234567890/my-video.mp4`)
   - ⚠️ **Don't use**: `https://player.cloudinary.com/embed/...` (this won't work)

2. **Add to Sanity Studio**
   - Create a new Vault Item
   - Set **Category** to `video`
   - In the **Media (Image/Video)** field:
     - Leave "Image/Video File" empty
     - Paste either:
       - The **public ID** (e.g., `Golden_BullCoin_jthgvt`)
       - OR the **direct video URL** (e.g., `https://res.cloudinary.com/basecreator/video/upload/v123/video.mp4`)
     - The system will auto-convert embed URLs if you accidentally paste them
   - Fill in title, description, etc.
   - **Publish**

### **Option 2: Use Direct Video URLs**

If your video is hosted elsewhere (Vimeo, YouTube, custom server):

1. Get the direct video URL (must be `.mp4`, `.webm`, or similar)
2. In Sanity Studio:
   - Create a new Vault Item
   - Set **Category** to `video`
   - Paste the video URL in the **"Cloudinary URL"** field (despite the name, any video URL works)
   - **Publish**

## **Important Notes:**

- ✅ The **Category** must be set to `video` for items to appear as videos
- ✅ The video URL must be a direct link to a video file (not an embed code)
- ✅ For best performance, use Cloudinary which auto-optimizes videos
- ⚠️ Don't use the "Image/Video File" upload for videos - Sanity treats them as images

## **Thumbnails for Videos:**

Videos automatically use the **first frame** as a thumbnail! No manual upload needed.

### **Automatic Thumbnail (Default):**

✅ **For Cloudinary videos**, the system automatically:
- Extracts the first frame of the video
- Uses it as the thumbnail on video cards
- No extra work required!

### **Custom Thumbnail (Optional):**

If you want a different thumbnail than the first frame:

1. **In Sanity Studio**, when editing a video vault item
2. Scroll to the **"Thumbnail (for videos)"** field
3. Upload your custom image
4. **Publish** the item

### **Thumbnail Priority:**

1. ✅ **Custom thumbnail** (if uploaded)
2. ✅ **Auto-generated from first frame** (for Cloudinary videos)
3. Gradient background (fallback)

### **Best Practices:**

- 🎬 **Let it auto-generate** - The first frame usually works great
- 🎨 **Upload custom** - Only if first frame isn't ideal
- 📐 Use 16:9 aspect ratio if uploading custom thumbnails
- 🖼️ Keep custom thumbnails under 500KB for fast loading

## **Troubleshooting:**

**"Video not available" message?**
- Check that you published (not just saved) the vault item
- Verify the Cloudinary URL is correct and accessible
- Make sure Category is set to `video`

**Video shows as "image" type?**
- Check the browser console for the log `Mapped vault items`
- Verify `category: 'video'` in the console output
- Clear browser cache and refresh
