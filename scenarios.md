Scenarios to account for:

1. Inpatient Hospital (Acute) - Type One Teaching Hospital - DRG Codes
2. Inpatient Hospital (Acute) - Other Hospital - DRG Codes
3. Inpatient Hospital (Rehab) - CMG Codes
4. Inpatient Hospital (Rehab) - Type One Teaching Hospital - DRG Codes 
// NOTE: WHAT IS ICD 9 & 10?
////Use Revenue Codes
5. Inpatient Hospital (Rehab) - Other Hospital - DRG Codes
6. Outpatient Hospital (% of Charges) - Type One Teaching Hospital - Revenue Codes
7. Outpatient Hospital (% of Charges) - Other Hospital - Revenue Codes 
8. Outpatient Hospital (% of Charges) - Type One Teaching Hospital - CPT Codes
9. Outpatient Hospital (% of Charges) - Other Hospital - CPT Codes
10. Outpatient Hospital (% of Charges) - Type One Teaching Hospital - HCPCS Codes
11. Outpatient Hospital (% of Charges) - Other Hospital - HCPCS Codes
// NOTE: ALL HCPCS CODES STARTING WITH J????? I NEED THOSE ENUMERATED
/////Drema 08/01 - "Just use JCODE as the input for lookup."
12. Outpatient Hospital (Per Service) - Type One Teaching Hospital - CPT  Codes 
13. Outpatient Hospital (Per Service) - Other Hospital - CPT Codes 
14. Outpatient Hospital (Per Service) - Type One Teaching Hospital - HCPCS  Codes 
15. Outpatient Hospital (Per Service) - Other Hospital - HCPCS Codes 
16. Ambulatory Service Centers (% of Charges) - Revenue Codes
17. Ambulatory Service Centers (% of Charges) - Unlisted procedures and services / BR ????
18. Ambulatory Service Centers (Surgeries) - CPT Codes
19. Ambulatory Service Centers (Fluroscopy) - CPT Codes
20. Professional Services (% of Charges) - Injectable Drugs - HCPCS & CPT Subset
21. Professional Services (% of Charges) - Unlisted procedures ???
22. Professional Services (Anesthesia) - CPT + UNIT
23. Professional Services - Surgeons - CPT
24. Professional Services - Physician/Non-Surgeon - CPT
25. Professional Services - Other - HCPCS
26. Physical Medicine and Rehabilitation Services - CPT Codes - PER UNIT???
27. Osteopathic and Chiropractic Manipulative Treatment - CPT Codes
28. Acupuncture - CPT Codes 
29. Dental Services - HCPCS Codes
30. Ground Ambulance (Reimbursement Per Mile) - HCPCS Codes
31. Ground Ambulance (Reimbursement Per Trip) - HCPCS Codes
32. S Codes (Per Service) - HCPCS Codes
33. S Codes (Per Unit) - HCPCS Codes

Still TODO:
Remove the extra CPT codes in the Physician-All table (May be done but double-check, was struggling to get it to save the files)
Accomodate Anesthesia output to recent results and validate that it looks appropriate in Results
Add message/helper tesk functionality
Set consistent form validation
See about differentiating the injectable codes for prof services
Check on that crazy outlier thing Drema mentioned
Hitting enter breaks it. 
Fix anesthesia results to hide plus sign when there is no P modifier

Fix phantom modifier rendering

NICE TO HAVE:
Rewrite the code for Modifiers so I'm not storing the code + modifier in the JSON file. That's bad.
Double-back and handle the HCPCS+REV better (with a separate checkbox)
Refactor the zip results to eliminate repetitive code in the rendeR

DONE
Add a disclaimer (maybe?) - NOT NEEDED, Per Drema we can link to the tool on the public site where the disclaimer already exists