# Reciassist 🍳  
**Reciassist** is a recipe management web application built using **React + Vite**. It allows users to create, edit, and view cooking recipes with rich media, nutrition data, and instructions.

## 🚀 Features  
- Create and edit recipes with name, image, nutrition, difficulty, and categories.  
- Add rich-text descriptions and multimedia instructions.  
- Ingredient and instruction editor with validation.  
- Local mock API for development and testing.  
- Deployable to GitHub Pages for demo or static hosting.

## 📁 Project Structure  
```
FrontendWebDev_FinalProject/
├── Reciassist/                # Main Vite project folder
│   ├── public/
│   ├── src/
│   ├── mock-api/              # Mock API JSON data and config
│   ├── vite.config.js
│   └── index.html
```

## ⚙️ Installation  
> ⚠️ Run the following commands **inside the `Reciassist/` folder**.
```bash
cd Reciassist
npm install
```

## 🧪 Mock API Setup  
You don't need to run any things else to initialize data.
If you want to make custom data, access Reciassist/services/datas to modify data

## 🧾 Available Scripts  
Run these inside the `Reciassist/` folder:
- `npm run dev` – Start the dev server  
- `npm run build` – Build for production  
- `npm run preview` – Preview built app  
- `npm run deploy` – Deploy to GitHub Pages

> 💡 Make sure `vite.config.js` has correct `base` for GitHub Pages.

## 📦 Dependencies  
- React `^19.1.0`
- React DOM `^19.1.0`
- React Router DOM `^7.6.2`
- PrimeReact `^10.9.6` + PrimeIcons + PrimeFlex
- Tailwind CSS `^4.1.11`
- Framer Motion `^12.23.0`
- DnD Kit (Drag & Drop)
- FontAwesome (Solid, Regular, Brands)
- FullCalendar `^6.1.18`
- Chart.js `^4.5.0`
- Quill `^2.0.3` (WYSIWYG Editor)
- Zustand (Global State) `^5.0.5`
- uuid, nanoid (ID generation)
- Lucide React (Icons)
- BoxIcons, Classnames, IDB (IndexedDB)

## 👨‍💻 Notes  
- Uses id-based DOM validation  
- Uses `gh-pages` for deployment  
- Clean structure separating logic, UI, and mock API

## 📄 License  
MIT License – Free to use and modify.
