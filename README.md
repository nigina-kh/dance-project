# Fundamentals of Web Development Final Project – Dance Studio

## **Project Overview**
This is a **Dance Studio web application** that allows users to:  
- Browse available programs (**Group Classes**, **Individual Training**, **Performance Programs**)  
- Enroll in programs with **email** and **date selection**  
- View enrolled participants in a **calendar view**  

The project has a **frontend** built with **HTML, SCSS, and JavaScript**, and a **backend** using **Python Flask** with **SQLite** for data storage. The backend is integrated with **`products.html`** to manage program enrollments dynamically.  

## **Features**
- Dynamic program cards with **seat availability**  
- **Enrollment form** with validation  
- **Calendar** displaying enrolled participants  
- **Backend API endpoints** to manage programs and enrollments  

## **Project Structure**
- assets/                 # Images, fonts, icons, etc.
- backend/                # Flask backend
  - app.py
  - init_db.py
  - requirements.txt
- dist/                   # Compiled CSS for frontend
  - style.css
  - style.min.css
- js/                     # All JavaScript files
  - main.js
  - animations.js
  - mobile.js
- styles/                 # SCSS source files
  - style.scss
  - blocks/
    - breadcrumbs.scss
    - calendar.scss
    - contacts.scss
    - gallery.scss
    - header.scss
    - hero.scss
    - menu.scss
    - mobile.scss
    - pagination.scss
    - products.scss
- tests/                  # Tests
- index.html
- products.html           # Includes frontend logic to call backend
- calendar.html
- contacts.html
- gallery.html
- .gitignore
- README.md



## **Backend Setup (Optional for Local Development)**
1. Make sure **Python 3.11+** is installed.  
2. Navigate to the backend folder:  
   ```bash
   cd src/backend
## Install dependencies:
python -m pip install -r requirements.txt

## Initialize the database:
python init_db.py

## Run the backend server:
python app.py


## Backend will run at http://127.0.0.1:5000/, and products.html will fetch programs and enrollments from this API.

## **Frontend Setup**
Compile SCSS files to CSS (Autocode or your build setup handles this):
src/styles/style.scss → dist/style.css
src/styles/mobile.scss → dist/style.min.css
Open src/index.html or src/products.html in a browser.

## **Security Notes**
No sensitive keys are included in this project.
SQLite database (database.db) is safe to include locally; you can add it to .gitignore if desired.
This project is for learning purposes only.

## Developer

## Nigina Khasanova

