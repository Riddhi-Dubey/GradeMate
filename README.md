# GradeMate – CGPA & Percentage Calculator

A clean, modern, and responsive web application designed as a student utility tool for calculating marks percentage, SGPA, and CGPA in seconds.

Built with **HTML5, Vanilla CSS3, and Modular JavaScript**. 100% frontend, private, client-side, and works completely offline without databases, authentication, or external APIs.

---

## ✨ Features

### 1. 📊 Percentage Calculator
- **Simple Mode**:
  - Direct entry of **Marks Obtained** and **Total Marks**.
  - Dynamic display of percentage (`e.g., 78.50%`), marks obtained breakdown (`e.g., 392 / 500`), marks deducted, and academic standing.
  - Animated SVG circular gauge.
- **Subject-wise Mode**:
  - Dynamically add or remove subjects (`+ Add Subject`).
  - Input subject name, marks obtained, and maximum marks.
  - Instant calculation of total obtained marks, total maximum marks, and overall percentage.
- **Validation**:
  - Prevents negative values and marks exceeding maximum marks.
  - Friendly inline alert: *"Please enter marks between 0 and the maximum marks."*

### 2. 🎓 SGPA Calculator
- **Semester Grade Point Average**:
  - Add subjects with **Course Name**, **Credits (positive)**, and **Grade Point (0.0 to 10.0 scale)**.
  - Uses the official formula:
    $$\text{SGPA} = \frac{\sum (\text{Credit} \times \text{Grade Point})}{\sum \text{Credits}}$$
  - Displays: **Your SGPA**, **Total Credits**, **Total Credit Points**, and performance tier (e.g., *Outstanding*, *Excellent*, *Very Good*).
  - Prominent result card with circular progress meter.

### 3. 🏆 CGPA Calculator
- **Cumulative Grade Point Average**:
  - Dynamically add semesters (`Semester 1`, `Semester 2`, `Semester 3`, etc.).
  - Enter SGPA for each semester.
  - Uses the formula:
    $$\text{CGPA} = \text{Average of entered semester SGPAs}$$
  - Displays: **Your CGPA**, **Number of Semesters Included**, and average SGPA.
  - Quick action: **"Convert to Percentage ↓"** to instantly pass the calculated CGPA to the converter.

### 4. 🔄 CGPA → Percentage Converter
- Converts CGPA to percentage using standard and customizable multipliers:
  - **Standard Multiplier ($\times 9.5$)**: Default method used by CBSE, AICTE, and most Indian technical universities.
  - **Custom Multiplier**: Allows entering institution-specific multipliers (e.g., $10.0$, $9.5$, $9.0$).
- Official conversion note clearly displayed:
  > *«The CGPA-to-percentage conversion formula can vary by university/institution. The 9.5 multiplier is provided as a commonly used conversion method.»*

### 5. 🎯 Additional Features
- **Reset functionality** on every calculator to return to initial defaults.
- **Copy Result Summary** button with instant toast feedback.
- **Responsive design** tailored for smartphones, tablets, and desktop displays.
- **Smooth navigation** with sticky header and mobile navigation drawer.

---

## 📁 Project Structure

```
Bootcamp/
├── index.html              # Main application page with semantic HTML5
├── local-server.js        # Lightweight local Node.js static server
├── test-calcs.js           # Automated test suite for calculations & validations
├── css/
│   ├── style.css           # Core design system, variables, typography & layout
│   └── animations.css      # Micro-animations, keyframes & toast transitions
└── js/
    ├── app.js              # Header scroll, mobile drawer, toast & clipboard utils
    ├── percentage-calc.js  # Percentage calculator logic (Simple & Subject-wise)
    ├── sgpa-calc.js        # SGPA calculator logic (10-point scale)
    ├── cgpa-calc.js        # CGPA calculator logic (Semester averaging)
    └── converter.js        # CGPA to Percentage converter logic
```

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply double-click or open [index.html](file:///c:/Users/Riddhi%20Dubey/Desktop/Bootcamp/index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Using the Local Dev Server
Run the built-in server with Node.js:
```bash
node local-server.js
```
Then open:
```
http://127.0.0.1:3000/
```

### Option 3: Run Automated Calculation Tests
Verify all formula calculations and boundary conditions:
```bash
node test-calcs.js
```
