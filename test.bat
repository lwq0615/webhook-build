@echo off
rem 设置监听的端口号
set java-port=8898

echo java-port : %java-port%

for /f "usebackq tokens=1-5" %%a in (`netstat -ano ^| findstr %java-port%`) do (
	if [%%d] EQU [LISTENING] (
		set java-pid=%%e
	)
)

for /f "usebackq tokens=1-5" %%a in (`tasklist ^| findstr %java-pid%`) do (
	set java_name=%%a
)
rem 根据进程ID，kill进程
if "%java-pid%" neq "" (
  taskkill /f /pid %java-pid%
  echo kill process : port %java-port%, pid %java-pid% ,name %java_name%
)

java -jar ruoyi-admin.jar