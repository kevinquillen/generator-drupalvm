There are a few caveats when using Drupal VM on Linux, and this page will try to identify the main gotchas or optimization tips for those wishing to use Drupal VM on a Linux host.

## Platform-specific Install Instructions

### All Linux flavors

Always make sure your workstation is up to date (e.g. `apt-get update && apt-get upgrade` on Debian-like systems, or `dnf upgrade` or `yum upgrade` on Fedora/RedHat-like systems). There are sometimes bugs in the base OS packages (e.g. [this NFS-related bug](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1508510)) that can be resolved by a simple upgrade.

### Ubuntu

Ubuntu 15.10 for Desktop (and some other versions) doesn't include NFS support by default, so if you get a message like `It appears your machine doesn't support NFS`, then you should do the following to install NFS server: `sudo apt-get install -y nfs-server`.

### Fedora

Under Fedora, you might encounter a message like the following upon the first time you use VirtualBox or Vagrant:

```
$ vagrant status
VirtualBox is complaining that the kernel module is not loaded. Please
run `VBoxManage --version` or open the VirtualBox GUI to see the error
message which should contain instructions on how to fix this error.
```

In this case, you need to install your system's appropriate kernel module, and you'll also need to install `gcc` and run a specific VirtualBox installation script (or reinstall VirtualBox entirely) so the kernel module is loaded correctly. Do the following:

  1. `sudo dnf install "kernel-devel-uname-r == $(uname -r)"`
  2. `sudo dnf install gcc`
  3. `sudo /var/lib/vboxdrv.sh setup`

Periodically, when you upgrade your system's Linux kernel, you might need to run steps 2 and 3 above again, or you can uninstall and reinstall VirtualBox (e.g. `sudo dnf remove VirtualBox && sudo dnf install VirtualBox`).

## Synced Folders

Most issues have to do synced folders. These are the most common ones:

### 'Mounting NFS shared folders...' hangs

There are a few different reasons this particular problem can occur. You may run into the error below during `vagrant up`:

```
The following SSH command responded with a non-zero exit status.
Vagrant assumes that this means the command failed!

mount -o '' 192.168.88.1:'/Users/myusername/Sites/drupalvm' /var/www/drupalvm

Stdout from the command:



Stderr from the command:

stdin: is not a tty
mount.nfs: Connection timed out
```

If you get this message, then it's likely that either NFS isn't running correctly on your host, certain ports are protocols are being blocked by the system firewall, or you need to add additional mount options to your `vagrant_synced_folders` configuration. Try the following fixes:

  1. On Ubuntu, if you get a message like `It appears your machine doesn't support NFS`, run `sudo apt-get install -y nfs-server`.
  2. Install the `vagrant-vbguest` plugin, which will make sure you are running the latest version of the VirualBox Guest Additions inside the VM (this can solve many different problems!).
  3. Make sure the `vboxnet` interfaces are not being blocked by your system firewall. For Fedora (and many flavors of Linux), check out this guide for more: [Get Vagrant's NFS working under Fedora 20](https://web.archive.org/web/20150706105420/http://blog.bak1an.so/blog/2014/03/23/fedora-vagrant-nfs/).
  4. Add `mount_options: ['vers=3']` to your synced folder definition in config.yml after the other options like `local_path`, `destination`, and `type`.

After attempting any of the above fixes, run `vagrant reload --provision` to restart the VM and attempt mounting the synced folder again, or `vagrant destroy -f && vagrant up` to rebuild the VM from scratch.

## Intel VT-x virtualization support

On some laptops, Intel VT-x virtualization (which is built into most modern Intel processors) is enabled by default. This allows VirtualBox to run virtual machines efficiently using the CPU itself instead of software CPU emulation. If you get a message like "VT-x is disabled in the bios for both all cpu modes" or something similar, you may need to enter your computer's BIOS or UEFI settings and enable this virtualization support.
