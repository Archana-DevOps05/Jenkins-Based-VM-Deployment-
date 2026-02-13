# 🚀 Jenkins Based VM Deployment (Non-Containerized)

A complete CI/CD pipeline where a Node.js application is deployed directly to an AWS EC2 Virtual Machine using Jenkins — without Docker.

The pipeline automatically deploys the new version and verifies whether it is successfully running.

---

## 📌 What This Project Solves

Manual deployment problems:

* Need to SSH every time
* Forget to restart service
* Not sure new code deployed or not

This pipeline removes all manual work.

---

## 🏗️ Architecture

```
Developer Push → GitHub → Jenkins → SSH → EC2 → PM2 Restart → Version Check
```

---

## 🧰 Tech Stack

* Jenkins (Pipeline)
* Node.js (Express)
* AWS EC2 Ubuntu
* PM2 Process Manager
* Git & GitHub
* SSH Key Authentication

---

## 1️⃣ Launch EC2 Instance

Created Ubuntu EC2 and opened ports:

| Port | Purpose     |
| ---- | ----------- |       
| 8080 | Jenkins     |
| 3000 | Application |

---

## 2️⃣ Setup Application Server

### Install dependencies

```bash
sudo apt update
sudo apt install nodejs npm git -y
sudo npm install -g pm2
```

### Clone repository

```bash
git clone https://github.com/Archana-DevOps05/Jenkins-Based-VM-Deployment-.git
cd Jenkins_Based_VM_Deployment
npm install
pm2 start app.js --name app
pm2 save
```

Check:

```
http://<public-ip>:3000/version
```

---
<img width="1366" height="768" alt="node-version1 0-testing" src="https://github.com/user-attachments/assets/ee8d0f8d-cb15-4fce-b3e9-7c73eab641a7" />


## 3️⃣ Setup Jenkins Server

### Install Java

```bash
sudo apt install openjdk-17-jdk -y
```

### Install Jenkins

```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins -y
```

Start Jenkins:

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

Access:

```
http://<jenkins-ip>:8080
```

Get password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## 4️⃣ Configure SSH Access (Jenkins → EC2)

On Jenkins machine:

```bash
ssh-keygen
```

Copy key to server:

```bash
ssh-copy-id ubuntu@<ec2-ip>
```

Test:

```bash
ssh ubuntu@<ec2-ip>
```

---

## 5️⃣ Jenkins Credentials

Added in:

```
Manage Jenkins → Credentials → Global
```

Type:

```
Secret File (PEM Key)
```

Used for automated login to EC2.

---

## 6️⃣ Jenkins Pipeline Stages

| Stage    | Work                |
| -------- | ------------------- |
| Checkout | Pull code           |
| Install  | npm install         |
| Deploy   | SSH & restart app   |
| Wait     | Give app start time |
| Validate | Check version       |

---

## 7️⃣ Deployment Commands Executed by Jenkins

```bash
cd ~/Jenkins_Based_VM_Deployment
pm2 stop app || true
git pull origin master
npm install
pm2 start app.js --name app --update-env
pm2 save
```

---

## 8️⃣ Deployment Verification Logic

Jenkins checks:

```bash
curl http://server-ip:3000/version
```

Extract version and compare with:

```
version.txt
```

If mismatch → Build fails ❌
If match → Deployment success ✅

---

## 🖼️ Screenshots

### Pipeline Success

![Pipeline](screenshots/pipeline-success.png)

### Stage View

![Stages](screenshots/stage-view.png)

### Application UI

![UI](screenshots/app-ui.png)

---

## 🔁 How To Release New Version

Change version:

```
version.txt → v1.2
```

Push:

```bash
git add .
git commit -m "release v1.2"
git push
```

Jenkins auto deploys 🚀

---

## 🧠 DevOps Concepts Demonstrated

* CI/CD Pipeline
* SSH Automation
* Remote Deployment
* Process Management
* Health Check Validation
* Failure Safe Deployment

---

## 📍 Application URL

```
http://<public-ip>:3000
```

---

## 👩‍💻 Author

Archana Singh
