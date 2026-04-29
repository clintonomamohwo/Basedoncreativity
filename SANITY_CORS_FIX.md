# Fixing Sanity CORS Errors

If you see this error:
```
Error: Request error while attempting to reach is https://wxky32kg.apicdn.sanity.io/...
```

This is a **CORS (Cross-Origin Resource Sharing)** issue. Here's how to fix it:

---

## **Quick Fix:**

### 1. Go to Sanity CORS Settings
Visit: https://sanity.io/manage/personal/project/wxky32kg/api

### 2. Add CORS Origins

Click **"Add CORS origin"** and add these domains:

**For Production:**
```
https://www.bochq.com
https://bochq.com
```

**For Development:**
```
http://localhost:5173
http://localhost:3000
http://localhost:4173
```

**For Figma Make Preview (if applicable):**
```
https://figma-make-production.up.railway.app
```

### 3. Settings for Each Origin:

- ✅ **Allow credentials**: YES
- ✅ **Allowed methods**: GET, POST

### 4. Save and Wait

- Click **"Save"**
- Wait 1-2 minutes for changes to propagate
- **Hard refresh** your browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## **Still Not Working?**

### Check Your Domain

Make sure the domain in the error message matches what you added:

1. Look at the browser URL bar - what domain are you on?
2. Did you add that exact domain to CORS settings?
3. Include `https://` or `http://` prefix

### Temporary Wildcard (Testing Only)

⚠️ **For testing only** - add this origin:
```
*
```

This allows ALL domains (not secure for production, but helps confirm CORS is the issue).

If this works, remove `*` and add your specific domains.

---

## **Alternative: Disable CDN (Already Applied)**

I've already set `useCdn: false` in the code, which means it uses:
- `api.sanity.io` instead of `apicdn.sanity.io`

This sometimes helps if CDN has different CORS settings.

---

## **How to Verify CORS Settings:**

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for the Sanity connection test message:
   - ✅ `Sanity connection successful` = CORS is working
   - ❌ `Sanity connection failed: CORS` = CORS needs fixing

---

## **Need More Help?**

If you're still stuck:

1. Check browser console for the full error message
2. Verify you're logged into the correct Sanity account
3. Try clearing browser cache
4. Check if your network/firewall is blocking Sanity API

---

## **Why This Happens:**

Browsers block requests from one domain to another for security. Sanity needs to explicitly allow your domain to fetch data. Once you add your domain to CORS settings, the browser will allow the requests.
