# Fixes corrupted large TLS transfers (npm ci -> ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC
# / ERR_SSL_CIPHER_OPERATION_FAILED) inside Docker Desktop / WSL2 builds.
#
# Root cause: buggy Receive Segment Coalescing (RSC) + Large Send Offload (LSO) on the
# Windows host NIC and the WSL vSwitch corrupt large segments. Small transfers slip
# through; large ones (npm package tarballs) fail the TLS MAC check. It is NOT a cipher,
# CPU, or MTU problem -- disabling RSC/LSO on the host adapters fixes it for builds,
# git, curl, everything.
#
# Re-run this (elevated) after a Windows update, NIC-driver update, or if the error returns.
# Requires an ADMIN PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\fix-wsl-nic-offload.ps1

$ErrorActionPreference = "Continue"

# Active uplink + WSL vSwitch. Add other "Up" adapters (e.g. Ethernet) if you switch networks.
$adapters = @("Wi-Fi", "vEthernet (WSL (Hyper-V firewall))")

foreach ($a in $adapters) {
  try { Disable-NetAdapterRsc -Name $a -ErrorAction Stop; Write-Host "RSC disabled: $a" -ForegroundColor Green }
  catch { Write-Host "RSC skip ($a): $($_.Exception.Message)" -ForegroundColor Yellow }
  try { Disable-NetAdapterLso -Name $a -ErrorAction Stop; Write-Host "LSO disabled: $a" -ForegroundColor Green }
  catch { Write-Host "LSO skip ($a): $($_.Exception.Message)" -ForegroundColor Yellow }
}

Write-Host "`nCurrent RSC state:"
Get-NetAdapterRsc -ErrorAction SilentlyContinue |
  Select-Object Name, IPv4Enabled, IPv6Enabled | Format-Table -AutoSize
