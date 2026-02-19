#!/bin/bash

# Fix RoseSandbox Links Script
# Updates all internal links to match actual RoseSandbox file names

ROSESANDBOX_DIR="/Users/markyuzuk/CascadeProjects/MyMark/public/rosesandbox"

echo "========================================="
echo "Fixing RoseSandbox Internal Links"
echo "========================================="
echo ""

# Find all HTML files and update links
find "$ROSESANDBOX_DIR" -name "*.html" -type f -exec sed -i '' \
    -e 's|/about-us-option2-comprehensive\.html|about.html|g' \
    -e 's|/for-patients-option3-visual-story\.html|patients.html|g' \
    -e 's|/for-sponsors-option3-partnership\.html|sponsors.html|g' \
    -e 's|/for-site-owners-option2-growth\.html|site-owners.html|g' \
    -e 's|/join-a-study\.html|join-study.html|g' \
    -e 's|/landing-v4-patient-centric\.html|index.html|g' \
    {} +

echo "✅ All links updated successfully!"
echo ""
echo "Updated mappings:"
echo "  /about-us-option2-comprehensive.html → about.html"
echo "  /for-patients-option3-visual-story.html → patients.html"
echo "  /for-sponsors-option3-partnership.html → sponsors.html"
echo "  /for-site-owners-option2-growth.html → site-owners.html"
echo "  /join-a-study.html → join-study.html"
echo "  /landing-v4-patient-centric.html → index.html"
echo ""
