# Cloud Storage Migration Guide

## 🆚 **Comparison: AWS S3 vs Azure Blob vs Cloudinary**

| Feature | AWS S3 | Azure Blob | Cloudinary |
|---------|---------|------------|------------|
| **Free Tier** | 5GB storage, 20K GET requests | 5GB storage, lots of requests | 25GB storage, limited processing |
| **Video Size Limit** | 5TB per file | 5TB per file | Limited by processing power |
| **Setup Complexity** | Medium | Medium | Easy |
| **Global CDN** | Extra cost (CloudFront) | Extra cost (Azure CDN) | Included |
| **Video Processing** | Extra services needed | Extra services needed | Built-in |
| **Cost After Free Tier** | Very competitive | Competitive | More expensive |
| **Best For** | Large files, high traffic | Microsoft ecosystem | Image/video processing |

## 🎯 **Recommendation: AWS S3**

**Why AWS S3?**
- ✅ Generous free tier (5GB is plenty for your videos)
- ✅ No file size processing limits
- ✅ Industry standard, very reliable
- ✅ Pay-as-you-use after free tier
- ✅ Easy to set up CloudFront CDN later if needed

## 🚀 **Quick Setup Guide**

### **Option 1: AWS S3 (Recommended)**

1. **Create AWS Account**: Go to https://aws.amazon.com/
2. **Create S3 Bucket**: 
   - Go to S3 service
   - Create bucket with unique name (e.g., `your-name-portfolio-media`)
   - Enable public access for static hosting
3. **Get Credentials**:
   - Go to IAM → Users → Create User
   - Attach policy: `AmazonS3FullAccess`
   - Create Access Key
4. **Update Migration Script**: Edit `migrate-to-aws.js` with your credentials
5. **Run Migration**: `npm install aws-sdk && node migrate-to-aws.js`

### **Option 2: Azure Blob Storage**

1. **Create Azure Account**: Go to https://portal.azure.com/
2. **Create Storage Account**:
   - Create new Storage Account
   - Create container named `portfolio-media`
   - Set access level to "Blob (anonymous read access)"
3. **Get Credentials**:
   - Go to Storage Account → Access Keys
   - Copy account name and key
4. **Update Migration Script**: Edit `migrate-to-azure.js` with your credentials  
5. **Run Migration**: `npm install @azure/storage-blob && node migrate-to-azure.js`

## 📝 **Next Steps After Migration**

1. **Update Your Code**: Replace Cloudinary URLs with new cloud URLs
2. **Test Everything**: Verify all videos/images load correctly
3. **Clean Up**: Remove Cloudinary dependencies
4. **Optional**: Set up CDN for better performance

## 💡 **Pro Tips**

- **AWS**: Consider CloudFront CDN for global delivery (free tier: 1TB/month)
- **Azure**: Consider Azure CDN for better performance
- **Both**: Enable gzip compression for faster loading
- **Both**: Set proper cache headers for better performance

## 🎬 **Your Video Files**

Total size estimate: ~200-500MB (well within 5GB free tier)

Files to migrate:
- Ironman-edit.mp4
- MoonFinal.mp4
- Spiderman_edit.mp4
- WolverineFinal.mp4
- Salesman2.mp4

Plus thumbnails and images.

---

**Ready to migrate? Choose your preferred option and follow the setup guide above!**
