echo "Create a scratch org"
sfdx force:org:create -s -f config\project-scratch-def.json --setalias udemyLWCAmit --durationdays 7 --setdefaultusername

echo "Push The Source"
sfdx force:source:push

echo "Assign Permission Set"
sfdx force:user:permset:assign -n Source_Tracker

echo "Open Newly Created Scratch Org"
sfdx force:org:open

echo "Show The Org List"
sfdx force:org:list --all

echo "Create Password for Scratch Org"
sfdx force:user:password:generate