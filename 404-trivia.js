const questionBox = document.getElementById('question-box');
const statusMsg = document.getElementById('status-msg');
const interfaceBox = document.getElementById('interface-box');
const escapeLink = document.getElementById('escape-link');

// Score display element
const scoreDisplay = document.createElement('div');
scoreDisplay.className = 'status-panel';
scoreDisplay.id = 'score-display';
scoreDisplay.style.marginTop = '5px';
document.querySelector('.terminal-box').insertBefore(scoreDisplay, interfaceBox);

let currentQuestion = null;
let shuffledChoices = [];
let isGameActive = true;
let streak = 0;
let totalCorrect = 0;

// 100 Questions - Expanded Trivia Pool
const triviaPool = [
  // File Operations (Questions 1-10)
  {
    q: "Which command forces a recursive deletion of a directory and all its contents without asking?",
    a: "rm -rf",
    decoy1: "rmdir",
    decoy2: "delete -all"
  },
  {
    q: "Which command displays the current working directory path?",
    a: "pwd",
    decoy1: "cd",
    decoy2: "dir"
  },
  {
    q: "Which command creates a new directory?",
    a: "mkdir",
    decoy1: "mkfolder",
    decoy2: "newdir"
  },
  {
    q: "What command moves or renames files in Linux?",
    a: "mv",
    decoy1: "move",
    decoy2: "rename"
  },
  {
    q: "Which command copies files or directories?",
    a: "cp",
    decoy1: "copy",
    decoy2: "duplicate"
  },
  {
    q: "What command removes an empty directory?",
    a: "rmdir",
    decoy1: "del_dir",
    decoy2: "remove -dir"
  },
  {
    q: "Which command shows file types in Linux?",
    a: "file",
    decoy1: "type -f",
    decoy2: "checkfile"
  },
  {
    q: "What command extracts a tar archive?",
    a: "tar -xf",
    decoy1: "untar",
    decoy2: "extract -tar"
  },
  {
    q: "Which command counts lines, words, and characters in a file?",
    a: "wc",
    decoy1: "count",
    decoy2: "length"
  },
  {
    q: "What command concatenates and displays files?",
    a: "cat",
    decoy1: "combine",
    decoy2: "merge"
  },
  
  // Permissions & Ownership (Questions 11-15)
  {
    q: "Which terminal command is used to completely change file read/write/execute permissions?",
    a: "chmod",
    decoy1: "chown",
    decoy2: "setperm"
  },
  {
    q: "What command changes file ownership?",
    a: "chown",
    decoy1: "ownchange",
    decoy2: "setowner"
  },
  {
    q: "Which command sets the sticky bit on a directory?",
    a: "chmod +t",
    decoy1: "setsticky",
    decoy2: "bit +lock"
  },
  {
    q: "What permission value represents rwx for owner, r-x for group, r-- for others?",
    a: "754",
    decoy1: "644",
    decoy2: "744"
  },
  {
    q: "Which command displays file permissions in long format?",
    a: "ls -l",
    decoy1: "permissions",
    decoy2: "perm-list"
  },
  
  // Text Processing (Questions 16-22)
  {
    q: "Which command shows the first lines of a file?",
    a: "head",
    decoy1: "top",
    decoy2: "begin"
  },
  {
    q: "What command shows the last lines of a file?",
    a: "tail",
    decoy1: "bottom",
    decoy2: "end"
  },
  {
    q: "Which utility command allows you to view system log file updates in real-time as they print?",
    a: "tail -f",
    decoy1: "cat -live",
    decoy2: "watch -log"
  },
  {
    q: "What command searches for a pattern in files recursively?",
    a: "grep -r",
    decoy1: "search -all",
    decoy2: "find -match"
  },
  {
    q: "Which command sorts lines of text alphabetically?",
    a: "sort",
    decoy1: "order",
    decoy2: "arrange"
  },
  {
    q: "What command removes duplicate lines from a sorted file?",
    a: "uniq",
    decoy1: "unique",
    decoy2: "nodup"
  },
  {
    q: "Which command transforms text, such as deleting or translating characters?",
    a: "tr",
    decoy1: "translate",
    decoy2: "convert"
  },
  
  // Process Management (Questions 23-28)
  {
    q: "What command shows running processes on the system?",
    a: "ps aux",
    decoy1: "process list",
    decoy2: "show -tasks"
  },
  {
    q: "Which command terminates a running process by PID?",
    a: "kill",
    decoy1: "stop",
    decoy2: "terminate"
  },
  {
    q: "What command brings a background job to the foreground?",
    a: "fg",
    decoy1: "foreground",
    decoy2: "top-job"
  },
  {
    q: "Which command sends a job to the background?",
    a: "bg",
    decoy1: "background",
    decoy2: "back-job"
  },
  {
    q: "What command displays currently logged-in users?",
    a: "who",
    decoy1: "users",
    decoy2: "logged"
  },
  {
    q: "Which command shows real-time process activity?",
    a: "top",
    decoy1: "taskmonitor",
    decoy2: "procview"
  },
  
  // User Management (Questions 29-32)
  {
    q: "What command switches to another user account in Linux?",
    a: "su",
    decoy1: "sudo",
    decoy2: "userswitch"
  },
  {
    q: "Which command adds a new user?",
    a: "useradd",
    decoy1: "adduser",
    decoy2: "create-user"
  },
  {
    q: "What command changes a user's password?",
    a: "passwd",
    decoy1: "password-change",
    decoy2: "setpass"
  },
  {
    q: "Which command shows who you are currently logged in as?",
    a: "whoami",
    decoy1: "myuser",
    decoy2: "currentuser"
  },
  
  // Network Commands (Questions 33-38)
  {
    q: "What command downloads a file from a URL in the terminal?",
    a: "curl -O",
    decoy1: "wget save",
    decoy2: "download -url"
  },
  {
    q: "Which command tests network connectivity to a host?",
    a: "ping",
    decoy1: "connect",
    decoy2: "testlink"
  },
  {
    q: "What command shows the path packets take to reach a destination?",
    a: "traceroute",
    decoy1: "routepath",
    decoy2: "trace-path"
  },
  {
    q: "Which command displays network interface configuration?",
    a: "ifconfig",
    decoy1: "netconf",
    decoy2: "ipconfig"
  },
  {
    q: "What command shows active network connections?",
    a: "netstat",
    decoy1: "connlist",
    decoy2: "network-view"
  },
  {
    q: "Which command resolves hostnames to IP addresses?",
    a: "nslookup",
    decoy1: "dns-query",
    decoy2: "hostname"
  },
  
  // System Information (Questions 39-43)
  {
    q: "Which command shows system uptime and load average?",
    a: "uptime",
    decoy1: "loadtime",
    decoy2: "sys-up"
  },
  {
    q: "What command shows disk space usage of filesystems?",
    a: "df -h",
    decoy1: "diskfree",
    decoy2: "space-report"
  },
  {
    q: "Which command shows disk usage of files and directories?",
    a: "du -sh",
    decoy1: "disk -size",
    decoy2: "usage -report"
  },
  {
    q: "What command displays kernel version information?",
    a: "uname -r",
    decoy1: "kernel-ver",
    decoy2: "version-info"
  },
  {
    q: "Which command shows memory usage statistics?",
    a: "free -h",
    decoy1: "meminfo",
    decoy2: "ram-report"
  },
  
  // Advanced Commands (Questions 44-50)
  {
    q: "Which command finds the location of an executable in PATH?",
    a: "which",
    decoy1: "locate",
    decoy2: "whereis"
  },
  {
    q: "What command compresses a file using gzip?",
    a: "gzip",
    decoy1: "zipfile",
    decoy2: "compress"
  },
  {
    q: "Which command lists all environment variables?",
    a: "env",
    decoy1: "variables",
    decoy2: "vars-list"
  },
  {
    q: "What command creates a symbolic link?",
    a: "ln -s",
    decoy1: "link -sym",
    decoy2: "symlink"
  },
  {
    q: "Which command sets or clears file attributes?",
    a: "chattr",
    decoy1: "setattr",
    decoy2: "fileattr"
  },
  {
    q: "What command schedules periodic tasks?",
    a: "crontab",
    decoy1: "scheduler",
    decoy2: "cron-task"
  },
  {
    q: "Which command finds files matching specific patterns?",
    a: "find",
    decoy1: "searchfiles",
    decoy2: "locate-files"
  },

  // Additional Questions 51-100
  {
    q: "Which command displays the last lines of a file continuously?",
    a: "tail -f",
    decoy1: "watch file",
    decoy2: "follow -tail"
  },
  {
    q: "What is the default user UID in Linux?",
    a: "1000",
    decoy1: "0",
    decoy2: "500"
  },
  {
    q: "Which command creates an empty file?",
    a: "touch",
    decoy1: "create",
    decoy2: "newfile"
  },
  {
    q: "Which command changes the current directory?",
    a: "cd",
    decoy1: "goto",
    decoy2: "chdir"
  },
  {
    q: "How do you list all files including hidden ones?",
    a: "ls -a",
    decoy1: "ls -all",
    decoy2: "show-hidden"
  },
  {
    q: "Which command displays file content in the terminal?",
    a: "cat",
    decoy1: "show",
    decoy2: "readfile"
  },
  {
    q: "What does 'sudo' stand for?",
    a: "superuser do",
    decoy1: "secure user do",
    decoy2: "system user do"
  },
  {
    q: "Which command shows the PID of the current shell?",
    a: "echo $$",
    decoy1: "pid",
    decoy2: "shell-pid"
  },
  {
    q: "How do you kill a process with SIGKILL signal?",
    a: "kill -9",
    decoy1: "force-kill",
    decoy2: "kill -SIGKILL"
  },
  {
    q: "Which command compresses files with the best ratio?",
    a: "xz",
    decoy1: "gzip",
    decoy2: "bzip2"
  },
  {
    q: "What is the path to the main crontab configuration file?",
    a: "/etc/crontab",
    decoy1: "/var/cron/config",
    decoy2: "/usr/local/cron"
  },
  {
    q: "Which command shows command history?",
    a: "history",
    decoy1: "cmd-history",
    decoy2: "previous"
  },
  {
    q: "How to find all files named 'test.txt'?",
    a: "find / -name test.txt",
    decoy1: "search -name test.txt",
    decoy2: "locate test.txt"
  },
  {
    q: "Which command resets file access times?",
    a: "touch",
    decoy1: "reset-time",
    decoy2: "update-atime"
  },
  {
    q: "What does 'df -T' show?",
    a: "Filesystem types",
    decoy1: "Free space only",
    decoy2: "Partition drives"
  },
  {
    q: "Which symbol redirects output and overwrites?",
    a: ">",
    decoy1: ">>",
    decoy2: "|"
  },
  {
    q: "Which symbol redirects output and appends?",
    a: ">>",
    decoy1: ">",
    decoy2: "<<"
  },
  {
    q: "What does the pipe command '|' do?",
    a: "Pipes output as input to next command",
    decoy1: "Splits processes",
    decoy2: "Connects networks"
  },
  {
    q: "Which command displays environment variables?",
    a: "env",
    decoy1: "printenv",
    decoy2: "show-vars"
  },
  {
    q: "Which file contains user accounts?",
    a: "/etc/passwd",
    decoy1: "/etc/users",
    decoy2: "/var/log/accounts"
  },
  {
    q: "Which command lists open network ports?",
    a: "ss -tuln",
    decoy1: "netstat -ports",
    decoy2: "list-ports"
  },
  {
    q: "What does 'chmod 644' mean?",
    a: "rw-r--r--",
    decoy1: "rwxr-xr-x",
    decoy2: "rw-rw-r--"
  },
  {
    q: "Which command shows kernel messages?",
    a: "dmesg",
    decoy1: "kernel-log",
    decoy2: "boot-messages"
  },
  {
    q: "How to verify ISO file integrity?",
    a: "sha256sum",
    decoy1: "md5check",
    decoy2: "verify-hash"
  },
  {
    q: "Which command shows CPU usage in real-time?",
    a: "mpstat",
    decoy1: "cpu-monitor",
    decoy2: "process-cpu"
  },
  {
    q: "What is the maximum number of primary partition letters?",
    a: "4",
    decoy1: "26",
    decoy2: "8"
  },
  {
    q: "Which directory contains device files?",
    a: "/dev",
    decoy1: "/devices",
    decoy2: "/hardware"
  },
  {
    q: "Which directory contains temporary files?",
    a: "/tmp",
    decoy1: "/temp",
    decoy2: "/cache"
  },
  {
    q: "Which command shows the IP address of a host?",
    a: "ip addr",
    decoy1: "getip",
    decoy2: "addr-show"
  },
  {
    q: "What is port 22 by default?",
    a: "SSH",
    decoy1: "HTTP",
    decoy2: "FTP"
  },
  {
    q: "Which command connects remotely to a server?",
    a: "ssh",
    decoy1: "remote-connect",
    decoy2: "login-server"
  },
  {
    q: "How to remove all .log files recursively?",
    a: "find . -name '*.log' -delete",
    decoy1: "rm *.log -R",
    decoy2: "delete-all logs"
  },
  {
    q: "Which command shows mount points?",
    a: "mount",
    decoy1: "disk-mount",
    decoy2: "show-mounts"
  },
  {
    q: "What is UID 0?",
    a: "root",
    decoy1: "admin",
    decoy2: "superuser"
  },
  {
    q: "Which command changes file ownership?",
    a: "chown",
    decoy1: "change-owner",
    decoy2: "set-user"
  },
  {
    q: "Which character starts a variable?",
    a: "$",
    decoy1: "#",
    decoy2: "&"
  },
  {
    q: "How to execute a command as root?",
    a: "sudo",
    decoy1: "run-root",
    decoy2: "admin-mode"
  },
  {
    q: "Which command lists loaded modules?",
    a: "lsmod",
    decoy1: "module-list",
    decoy2: "show-modules"
  },
  {
    q: "What does 'grep -i' do?",
    a: "Ignores case sensitivity",
    decoy1: "Inverse search",
    decoy2: "Interactive mode"
  },
  {
    q: "Which command shows process hierarchy?",
    a: "pstree",
    decoy1: "tree-proc",
    decoy2: "process-tree"
  },
  {
    q: "How to see a user's login time?",
    a: "last",
    decoy1: "log-times",
    decoy2: "user-login"
  },
  {
    q: "Which command loads kernel modules?",
    a: "modprobe",
    decoy1: "load-module",
    decoy2: "insert-kmod"
  },
  {
    q: "What is the default shell in most distributions?",
    a: "bash",
    decoy1: "sh",
    decoy2: "zsh"
  },
  {
    q: "Which command compresses with lzma?",
    a: "xz",
    decoy1: "lzma-compress",
    decoy2: "7zip"
  },
  {
    q: "How to see shell version?",
    a: "echo $SHELL",
    decoy1: "shell-version",
    decoy2: "bash --version"
  },
  {
    q: "Which command shows inode information?",
    a: "ls -i",
    decoy1: "inode-list",
    decoy2: "show-inodes"
  },
  {
    q: "What is /proc?",
    a: "Virtual filesystem for kernel data",
    decoy1: "Process directory",
    decoy2: "Programs folder"
  },
  {
    q: "Which command syncs data to disk?",
    a: "sync",
    decoy1: "flush-disk",
    decoy2: "write-data"
  },
  {
    q: "How to install packages in Debian?",
    a: "apt install",
    decoy1: "install-package",
    decoy2: "dpkg-get"
  },
  {
    q: "Which command updates the package list?",
    a: "apt update",
    decoy1: "refresh-packages",
    decoy2: "upgrade-list"
  },
  {
    q: "Which command shows installed packages?",
    a: "dpkg -l",
    decoy1: "pkg-list",
    decoy2: "installed-packages"
  },
  {
    q: "What command checks disk health?",
    a: "smartctl",
    decoy1: "disk-check",
    decoy2: "health-monitor"
  },
  {
    q: "Which command monitors disk I/O?",
    a: "iotop",
    decoy1: "disk-io",
    decoy2: "io-monitor"
  },
  {
    q: "What command shows swap usage?",
    a: "swapon --show",
    decoy1: "swap-status",
    decoy2: "memory-swap"
  },
  {
    q: "Which command limits process priority?",
    a: "nice",
    decoy1: "priority-set",
    decoy2: "limit-cpu"
  },
  {
    q: "What command renices a running process?",
    a: "renice",
    decoy1: "change-nice",
    decoy2: "adjust-priority"
  },
  {
    q: "Which command measures network speed?",
    a: "speedtest-cli",
    decoy1: "net-speed",
    decoy2: "bandwidth-test"
  },
  {
    q: "What command captures network traffic?",
    a: "tcpdump",
    decoy1: "packet-capture",
    decoy2: "network-sniff"
  },
  {
    q: "Which command analyzes packet data?",
    a: "tshark",
    decoy1: "wireshark",
    decoy2: "packet-analyzer"
  },
  {
    q: "What command tests DNS resolution?",
    a: "dig",
    decoy1: "dns-test",
    decoy2: "resolve-check"
  },
  {
    q: "Which command checks mail server connection?",
    a: "telnet",
    decoy1: "mail-test",
    decoy2: "smtp-check"
  },
  {
    q: "What command verifies SSL certificates?",
    a: "openssl s_client",
    decoy1: "cert-check",
    decoy2: "ssl-verify"
  },
  {
    q: "Which command generates random passwords?",
    a: "pwgen",
    decoy1: "rand-pass",
    decoy2: "password-gen"
  },
  {
    q: "What command hashes passwords securely?",
    a: "openssl passwd",
    decoy1: "hash-password",
    decoy2: "encrypt-pass"
  },
  {
    q: "Which command compares two files?",
    a: "diff",
    decoy1: "compare",
    decoy2: "file-diff"
  },
  {
    q: "What command merges two sorted files?",
    a: "comm",
    decoy1: "merge-files",
    decoy2: "join-files"
  },
  {
    q: "Which command cuts columns from text?",
    a: "cut",
    decoy1: "column-cut",
    decoy2: "select-column"
  },
  {
    q: "What command prints columns from text?",
    a: "awk",
    decoy1: "column-print",
    decoy2: "print-fields"
  },
  {
    q: "Which command expands tabs to spaces?",
    a: "expand",
    decoy1: "tab-space",
    decoy2: "tabs-to-spaces"
  },
  {
    q: "What command converts tabs to spaces inversely?",
    a: "unexpand",
    decoy1: "spaces-tab",
    decoy2: "reverse-expand"
  },
  {
    q: "Which command writes from stdin to stdout?",
    a: "tee",
    decoy1: "split-write",
    decoy2: "pipe-copy"
  },
  {
    q: "What command reverses lines in a file?",
    a: "tac",
    decoy1: "reverse-lines",
    decoy2: "flip-file"
  },
  {
    q: "Which command reverses characters in each line?",
    a: "rev",
    decoy1: "char-reverse",
    decoy2: "reverse-text"
  },
  {
    q: "What command pads lines to fixed width?",
    a: "padsp",
    decoy1: "line-pad",
    decoy2: "fixed-width"
  },
  {
    q: "Which command joins fields from files?",
    a: "join",
    decoy1: "field-join",
    decoy2: "merge-fields"
  },
  {
    q: "What command splits a file into pieces?",
    a: "split",
    decoy1: "file-split",
    decoy2: "chunk-file"
  },
  {
    q: "Which command shows directory tree structure?",
    a: "tree",
    decoy1: "dir-tree",
    decoy2: "folder-tree"
  },
  {
    q: "What command calculates checksums?",
    a: "md5sum",
    decoy1: "checksum",
    decoy2: "hash-calc"
  },
  {
    q: "Which command archives with compression?",
    a: "tar -czf",
    decoy1: "archive-zip",
    decoy2: "compress-tar"
  },
  {
    q: "What command extracts compressed archive?",
    a: "tar -xzf",
    decoy1: "unarchive",
    decoy2: "extract-gz"
  },
  {
    q: "Which command lists archive contents?",
    a: "tar -tzf",
    decoy1: "list-archive",
    decoy2: "archive-contents"
  },
  {
    q: "What command benchmarks disk speed?",
    a: "hdparm -t",
    decoy1: "disk-bench",
    decoy2: "speed-test"
  },
  {
    q: "Which command checks filesystem errors?",
    a: "fsck",
    decoy1: "disk-check",
    decoy2: "fs-validator"
  },
  {
    q: "What command creates a filesystem?",
    a: "mkfs",
    decoy1: "fs-create",
    decoy2: "make-fs"
  },
  {
    q: "Which command resizes a filesystem?",
    a: "resize2fs",
    decoy1: "fs-resize",
    decoy2: "change-size"
  },
  {
    q: "What command mounts a filesystem?",
    a: "mount",
    decoy1: "attach-fs",
    decoy2: "connect-drive"
  },
  {
    q: "Which command unmounts a filesystem?",
    a: "umount",
    decoy1: "detach-fs",
    decoy2: "disconnect-drive"
  }
];

function initTriviaChallenge() {
  isGameActive = true;
  statusMsg.innerText = "Select the correct command statement:";
  // REMOVED: escapeLink.classList.add('hidden'); - Kept visible once granted
  interfaceBox.classList.remove('hidden');
  
  // Display current score
  scoreDisplay.innerHTML = `<span style="color: #00ff33;">STREAK: ${streak} | TOTAL: ${totalCorrect}</span>`;

  const randomIndex = Math.floor(Math.random() * triviaPool.length);
  currentQuestion = triviaPool[randomIndex];

  questionBox.innerText = currentQuestion.q;

  let choicesList = [currentQuestion.a, currentQuestion.decoy1, currentQuestion.decoy2];
  
  // Shuffle choices
  for (let i = choicesList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = choicesList[i];
    choicesList[i] = choicesList[j];
    choicesList[j] = temp;
  }
  
  shuffledChoices = choicesList;

  for (let i = 0; i < 3; i++) {
    document.getElementById("choice-" + i).innerText = shuffledChoices[i];
  }
}

function verifyTriviaAnswer(selectedIndex) {
  if (!isGameActive) return;

  const userChoice = shuffledChoices[selectedIndex];

  if (userChoice === currentQuestion.a) {
    streak++;
    totalCorrect++;
    
    isGameActive = false;
    statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>ACCESS_GRANTED: Signature verified!</span>";
    scoreDisplay.innerHTML = `<span style="color: #00ff33;">STREAK: ${streak} | TOTAL: ${totalCorrect}</span>`;
    
    // Show escape link so user can leave if they want
    escapeLink.classList.remove('hidden');
    
    // Automatically load next question after short delay
    setTimeout(() => {
      initTriviaChallenge();
    }, 1000);
  } else {
    streak = 0;
    isGameActive = false;
    statusMsg.innerHTML = "<span style='color: #ff3333;'>SIGNATURE_REJECTED: Security wall triggered. Resetting...</span>";
    scoreDisplay.innerHTML = `<span style="color: #ff3333;">STREAK RESET | TOTAL: ${totalCorrect}</span>`;
    
    // Automatically reload after delay
    setTimeout(initTriviaChallenge, 1300);
  }
}

initTriviaChallenge();