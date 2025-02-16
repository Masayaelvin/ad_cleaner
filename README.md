# 🚀 **Ad Cleaner Chrome Extension**  

🔹 **Ad Cleaner** is a **Chrome extension** that removes **intrusive ads** and replaces them with **motivational quotes**.  
🔹 If ads clutter a webpage, you can enable **Total Silence Mode** to **completely remove them**, ensuring a distraction-free browsing experience.  
🔹 The extension is powered by a **Flask backend API**, which serves fresh quotes dynamically.  

---

## 📌 **Features**
✅ **Removes intrusive ads**  
✅ **Replaces ads with motivational quotes**  
✅ **Total Silence Mode** (completely removes ads instead of replacing them)  
✅ **Persistent toggle settings**  
✅ **Lightweight, fast, and easy to use**  

---

## 🛠 **Technologies Used**
### **Frontend (Chrome Extension)**
- **JavaScript** (for content scripts & popup interactions)  
- **HTML & CSS** (for the popup UI)  
- **Chrome Extensions API** (to modify webpage content)  

### **Backend (Hosted API)**
- **Flask** (Python web framework)  
- **Flask-CORS** (Handles cross-origin requests)  
- **Requests & JSON** (To fetch and store quotes)  
- **Deployed Online** (No need to run locally)  

---

## 📥 **How to Install & Use the Extension**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Masayaelvin/ad_cleaner.git
cd ad-cleaner-extension
```

---

### **2️⃣ Install the Extension in Chrome**
1. Open **Google Chrome** and go to:  
   ```
   chrome://extensions/
   ```
2. Enable **Developer Mode** (toggle at the top-right).  
3. Click **"Load Unpacked"**.  
4. Select the **extension folder (`ad-cleaner-extension`)**.  
5. The extension will now appear in your Chrome toolbar! 🎉  

---

### **3️⃣ Use the Extension**
1. **Click on the extension icon** to open the popup.  
2. **Enable or disable "Total Silence Mode"**:
   - **ON** → Removes all ads completely.  
   - **OFF** → Replaces ads with motivational quotes.  
3. Browse the web normally, and watch ads disappear or turn into **inspiring quotes!**  

---

## ⚙️ **How It Works**
- **Ad detection:** The extension scans webpages for known ad elements (`iframe`, `ins`, `div` with ad-related classes).  
- **Replacement:** It either removes them or replaces them with a **quote from the Flask API**.  
- **Backend API:** Hosted Flask server provides **random quotes** for ad replacement.  


## 🛠 **Contributing**
✅ **Fork the repository**  
✅ **Create a new branch** (`git checkout -b feature-branch`)  
✅ **Make improvements and push changes**  
✅ **Submit a pull request**  

---

## 📞 **Support & Contact**
📩 If you have **questions, issues, or suggestions**, feel free to open an **issue** on GitHub or contact my email. 🚀  
masayaelvin@gmail.com
---

🎉 **Enjoy a clutter-free, distraction-free browsing experience with Ad Cleaner!** 🚀🔥