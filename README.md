Export GitHub issues to TeamPulse

Usage:

node index https://api.github.com/repos/[your_repo_here]/issues
This will create the exported JSON with all issues. Add ?state=closed to the end of the URL to get closed issues.

node index import.json
This will convert the JSON issues list to CSV and will output an export.csv file.

The export.csv file can be uploaded in TeamPulse.

Since TeamPulse does not currently support importing status, closed issues should be imported first and then their status should be updated to Done using a Bulk update operation. After that the open issues can be imported as well.

