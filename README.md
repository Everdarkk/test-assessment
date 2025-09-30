# Test Assessment for **deploi.org**

You can download the test CSV from the public `/csv` route of the project.

---

## 🏦 Credit Institutions — Core Features

### 1. Create Profile

**Profile fields:**

- Name  
- Country  
- Founding Year  
- Total Portfolio  
- Credit Risk Score  
- Product Type: `Mortgage` / `Private` / `Business`  
- Website URL  
- Contacts

**API Endpoint:** `create-profile (profile)`

---

### 2. Import Loan Data (CSV Upload)

Each loan record must contain:

- Loan ID *(unique)*
- Status
- Amount
- Payment Schedule
- Interest Charged to Borrower
- LTV *(if collateral)*
- Risk Group
- URL Reference to Agreement

**Action:** User clicks **“Upload CSV”** to submit data.

**API Endpoint:** `upload-csv (file)`

---

### 3. Loan Status Change

Loan status automatically transitions based on expiration:

`ACTIVE → EXPIRED`

---

### 4. Tokenize Loans

Credit institutions can tokenize loans.

**API Endpoint:** `tokenize-loans (loan)`

---

## 📊 Dashboard Overview

### Summary Sections:

- Total Imported Loans
- Total Tokenized Loans

### Charts & Metrics:

- **Total Loan Amount** (EUR & %)
- **Total Tokenised Amount** (EUR & %)
- **Total Invest**
