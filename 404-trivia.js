    const questionBox = document.getElementById('question-box');
    const statusMsg = document.getElementById('status-msg');
    const interfaceBox = document.getElementById('interface-box');
    const escapeLink = document.getElementById('escape-link');

    let currentQuestion = null;
    let shuffledChoices = [];
    let isGameActive = true;

    // 50 Questions - Expanded Trivia Pool
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
      }
    ];

    function initTriviaChallenge() {
      isGameActive = true;
      statusMsg.innerText = "Select the correct command statement:";
      escapeLink.classList.add('hidden');
      interfaceBox.classList.remove('hidden');

      const randomIndex = Math.floor(Math.random() * triviaPool.length);
      currentQuestion = triviaPool[randomIndex];

      questionBox.innerText = currentQuestion.q;

      let choicesList = [currentQuestion.a, currentQuestion.decoy1, currentQuestion.decoy2];
      
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
        isGameActive = false;
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>ACCESS_GRANTED: Signature verified!</span>";
        interfaceBox.classList.add('hidden');
        escapeLink.classList.remove('hidden');
      } else {
        statusMsg.innerHTML = "<span style='color: #ff3333;'>SIGNATURE_REJECTED: Security wall triggered. Resetting...</span>";
        isGameActive = false;
        setTimeout(initTriviaChallenge, 1300);
      }
    }

    initTriviaChallenge();