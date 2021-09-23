echo "Create a scratch org"
sfdx force:org:create -s -f config\project-scratch-def.json --setalias udemyLWCAmit --durationdays 7 --setdefaultusername

echo "Push source if present"
sfdx force:source:push

echo "Assign permission set if present"
sfdx force:user:permset:assign -n Source_Tracker

echo "Open Newly Created Scratch Org"
sfdx force:org:open

echo "Show Org List"
sfdx force:org:list