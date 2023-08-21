!macro customInstall
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Arrow" "" "Open Arrow here"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Arrow" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\Arrow\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\shell\Arrow" "" "Open Arrow here"
  WriteRegStr HKCU "Software\Classes\Directory\shell\Arrow" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\shell\Arrow\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Drive\shell\Arrow" "" "Open Arrow here"
  WriteRegStr HKCU "Software\Classes\Drive\shell\Arrow" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Drive\shell\Arrow\command" "" `$appExe "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\ArrowAsAdmin" "" "Open Arrow here as Administrator"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\ArrowAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\Background\shell\ArrowAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`

  WriteRegStr HKCU "Software\Classes\Directory\shell\ArrowAsAdmin" "" "Open Arrow here as Administrator"
  WriteRegStr HKCU "Software\Classes\Directory\shell\ArrowAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Directory\shell\ArrowAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`

  WriteRegStr HKCU "Software\Classes\Drive\shell\ArrowAsAdmin" "" "Open Arrow here as Administrator"
  WriteRegStr HKCU "Software\Classes\Drive\shell\ArrowAsAdmin" "Icon" "$appExe"
  WriteRegStr HKCU "Software\Classes\Drive\shell\ArrowAsAdmin\command" "" `wscript.exe "$LOCALAPPDATA\Microsoft\WindowsApps\Cache/helper.vbs" "$appExe" "%V"`
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\Arrow"
  DeleteRegKey HKCU "Software\Classes\Directory\shell\Arrow"
  DeleteRegKey HKCU "Software\Classes\Drive\shell\Arrow"
!macroend

!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro customInit
  IfFileExists $LOCALAPPDATA\Arrow\Update.exe 0 +2
  nsExec::Exec '"$LOCALAPPDATA\Arrow\Update.exe" --uninstall -s'
!macroend