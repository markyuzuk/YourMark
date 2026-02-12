# Sensorium Website - Client Review Instructions

## Welcome!

This is the Version 5 website for Sensorium Clinical Research. Below you'll find everything you need to review and interact with the site.

---

## Website Access

**Homepage**: `http://[your-server-address]/landing-v4-patient-centric.html`

### Key Pages to Review

1. **Homepage** - `landing-v4-patient-centric.html`
   - Overview of Sensorium's mission and approach
   - "What Makes Us Different" section highlighting key values

2. **For Patients** - `for-patients-option3-visual-story.html`
   - Patient-focused content with visual storytelling
   - Why participate section with benefits
   - How it works process flow
   - **Working referral form** (if backend is deployed)

3. **For Sponsors** - `for-sponsors-option3-partnership.html`
   - Partnership opportunities for pharmaceutical companies
   - Community-focused approach to clinical trials

4. **For Site Owners** - `for-site-owners-option2-growth.html`
   - Information for independent research sites
   - Growth and partnership model

5. **About Us** - `about-us-option2-comprehensive.html`
   - Company story and mission
   - Leadership team
   - Resources and insights
   - Locations

6. **Contact** - `contact.html`
   - Contact options for different audiences
   - Direct contact information

---

## Navigation

The website uses a consistent navigation bar across all pages:

- **Sensorium Logo** (top left) - Returns to homepage
- **About** - Company information
- **For Patients** - Patient resources
- **For Sponsors** - Partnership information
- **For Site Owners** - Network growth opportunities
- **Get Started** - Contact page

All navigation links are functional and will take you to the appropriate pages.

---

## Interactive Features

### Referral Form (For Patients Page)
If the full backend is deployed:

1. Scroll to "Refer a Friend" section on the For Patients page
2. Fill out the form with your information and a friend's information
3. Click "Send Referral"
4. You'll see a thank you popup for 3 seconds
5. The page will automatically refresh

**Note**: If only static HTML is deployed, the form will be visible but won't submit data.

### Admin Dashboard (Backend Only)
If the full backend is deployed:

**URL**: `http://[your-server-address]:3000/admin`

**Login Credentials**:
- Username: `admin`
- Password: `admin123` (or the password provided by your developer)

**Features**:
- View all submitted referrals
- See statistics (total, weekly, monthly)
- Delete referrals
- Change admin password

---

## Design Elements to Note

### Color Scheme
- **Primary Blue/Purple**: Used for site owners and general pages
- **Rose/Pink**: Used for patient-focused pages (For Patients)
- **Gradients**: Smooth transitions between colors for modern look

### Visual Elements
- **Hero Bar Icons**: Each major page has a thematic icon in the hero section
  - For Patients: People holding hands (community)
  - About Us: Brain icon (sensorium concept)
  - For Sponsors: Network icon (connections)
  - For Site Owners: Strategic planning icon

### Typography
- **Serif Font**: Used for headlines and emphasis
- **Sans-serif Font**: Used for body text and modern sections

---

## Testing Checklist

### Desktop Review
- [ ] Visit homepage and review content
- [ ] Click through all navigation links
- [ ] Review each of the 6 main pages
- [ ] Test all CTA (Call-to-Action) buttons
- [ ] Try submitting the referral form (if backend deployed)
- [ ] Check that images load correctly

### Mobile Review
- [ ] Access site on mobile device
- [ ] Check that navigation menu works
- [ ] Verify content is readable
- [ ] Test buttons and links
- [ ] Check that forms are usable

### Functionality Testing
- [ ] All navigation links work
- [ ] CTA buttons lead to correct pages
- [ ] Referral form submits successfully (backend only)
- [ ] Admin dashboard accessible (backend only)
- [ ] Images and icons display correctly

---

## Feedback Areas

Please provide feedback on:

### Content
- Is the messaging clear and compelling?
- Does the content speak to each audience (patients, sponsors, site owners)?
- Are there any typos or grammatical errors?

### Design
- Is the visual design professional and modern?
- Do the colors work well together?
- Are the icons and images appropriate?
- Is the layout easy to navigate?

### User Experience
- Is it easy to find information?
- Do the navigation and buttons work intuitively?
- Is the site responsive on different devices?
- Does the referral form work smoothly?

### Technical
- Do all links work correctly?
- Are there any broken images or elements?
- Does the site load quickly?
- Any issues on specific browsers or devices?

---

## Known Features

### Working Elements
✅ All navigation links functional  
✅ All CTA buttons point to correct pages  
✅ Responsive design for mobile and desktop  
✅ Referral form with database storage (backend deployment)  
✅ Admin dashboard for managing referrals (backend deployment)  
✅ Consistent branding across all pages  

### Static vs. Full Stack
- **Static Deployment**: All pages viewable, referral form visible but non-functional
- **Full Stack Deployment**: Everything works including referral submissions and admin dashboard

---

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Responsive on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 and above)

---

## Questions or Issues?

If you encounter any issues or have questions:

1. **Technical Issues**: Contact your developer with:
   - Page URL where issue occurred
   - Browser and device information
   - Screenshot if possible
   - Description of the issue

2. **Content Questions**: Note the specific page and section

3. **Design Feedback**: Include page reference and specific element

---

## Next Steps After Review

1. **Provide Feedback**: Share your thoughts on content, design, and functionality
2. **Request Changes**: List any modifications or improvements needed
3. **Approve for Production**: Once satisfied, approve for final deployment
4. **Production Deployment**: Developer will deploy to final domain with SSL/HTTPS

---

## Version Information

- **Version**: 5.0
- **Review Date**: February 12, 2026
- **Status**: Ready for Client Review
- **Deployment Type**: [Static / Full Stack - will be specified by developer]

---

## Quick Reference

### Main Pages
- Homepage: `landing-v4-patient-centric.html`
- For Patients: `for-patients-option3-visual-story.html`
- For Sponsors: `for-sponsors-option3-partnership.html`
- For Site Owners: `for-site-owners-option2-growth.html`
- About: `about-us-option2-comprehensive.html`
- Contact: `contact.html`

### Admin Access (Backend Only)
- URL: `http://[server]:3000/admin`
- Username: `admin`
- Password: `admin123` (change after first login)

---

**Thank you for reviewing the Sensorium website!**

We look forward to your feedback and making any necessary improvements to ensure the site meets your needs and expectations.
