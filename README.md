# Killer Queen Seattle Streaming

## Streaming OS/Software Setup

The section describes the process for installing and setting up a Beelink SER5 mini computer with an operating system and all the necessary software for streaming.

### Installing the OS and base software

The operation system used for the guide is Arch Linux and it's installation guide the basis for this document. If you'd like to find out more detailed information, you can follow this link -> https://wiki.archlinux.org/title/installation_guide

#### Boot into the Arch Linux medium

1. Create a USB boot disk with Arch Linux
2. Boot Beelink and mash delete key to enter BIOS
3. Go to boot menu and adjust the boot order to have USB as highest priority
4. Reboot the computer with the Arch Linux medium connected

#### Connect to internet

> `root@archiso ~ # iwctl`
>
> `[iwd]# station wlan0 connect Toshi`
>
> `[iwd]# exit`
>
> `root@archiso ~ # ping archlinux.org`

#### Remove existing Windows partitions and create single Linux filesystem

Check existing disks and partitions

> `root@archiso ~ # fdisk -l`

Modify MVNe drive to remove existing partitions

> `root@archiso ~ # fdisk /dev/nvme0n1`

The existing EFI directory is small (100MB) so remove that and the Windows partitions. Add a new 1G partition and set type to `EFI System`. Add new partition that takes remaining space. It should default to Linux filesystem type. Write changes and exit

#### Create FAT32 file system for EFI

> `root@archiso ~ # mkfs.fat -F 32 /dev/nvme0n1p1`

#### Create ext4 file system

Note: this might take a little bit while creating the journal. Just wait for it to complete

> `root@archiso ~ # mkfs.ext4 /dev/nvme0n1p2`

#### Mount the file systems

> `root@archiso ~ # mount /dev/nvme0n1p2 /mnt`
>
> `root@archiso ~ # mount --mkdir /dev/nvme0n1p1 /mnt/boot`

#### Install essential packages

> `root@archiso ~ # pacstrap -K /mnt base linux linux-firmware vim grub efibootmgr git sudo amd-ucode`

### Configure the system

#### Fstab

> `root@archiso ~ # genfstab -U /mnt >> /mnt/etc/fstab`

#### Chroot into system

> `root@archiso ~ # arch-chroot /mnt`

#### Set time

> `[root@archiso /]# ln -sf /usr/share/zoneinfo/PST8PDT /etc/localtime`
>
> `[root@archiso /]# hwclock --systohc`

#### Localization

Edit `/etc/locale.gen` and uncomment `en_US.UTF-8`

> `[root@archiso /]# locale-gen`

Create `/etc/locale.conf` with the following contents

> LANG=en_US.UTF-8

#### Network configuration

Create `/etc/hostname` with the following contents. Replace the number 1 with the number that is designated for the streaming computer you are setting up

> kq-stream-1

#### Set root password

> `[root@archiso /]# passwd`

#### Set up GRUB boot loader

> `[root@archiso /]# grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id="ARCH KQ Seattle Streaming"`
>
> `[root@archiso /]# grub-mkconfig -o /boot/grub/grub.cfg`

#### Set up streaming user

> `[root@archiso /]# useradd -m stream`
>
> `[root@archiso /]# passwd stream`

#### Add streaming user to sudo

> `[root@archiso /]# visudo`

> Add in the line `stream ALL=(ALL:ALL) ALL`

#### Install streaming application

> `[root@archiso /]# pacman -S gnome networkmanager libva-mesa-driver vlc nodejs npm`

Select all selections for gnome

Select 1) noto-fonts-emoji for emoji-font

Select 2) pipewire-jack for jack

If you have issues with package signing run the following commmands

> `[root@archiso /]# rm -r /etc/pacman.d/gnupg`
>
> `[root@archiso /]# pacman-key --init`
>
> `[root@archiso /]# pacman-key --populate`

> `[root@archiso /]# flatpak install flathub com.obsproject.Studio`

#### Enable services and restart system

> `[root@archiso /]# systemctl enable gdm`
>
> `[root@archiso /]# systemctl enable NetworkManager`
>
> `[root@archiso /]# exit`
>
> `root@archiso ~ # umount -R /mnt`
>
> `root@archiso ~ # reboot`

#### Reboot into Gnome and configure system

Connect to wifi then open console and install vscode

> `[stream@kq-stream-1 ~]$ flatpak install flathub com.visualstudio.code`

#### Settings

Power settings - set Screen Blank to Never and Automatic Suspend to Off. Power Button Behavior to Power Off
Appearance - Style Dark


### Clone kqsea-stream GitHub repo

> `[stream@kq-stream-1]$ git clone https://github.com/hitoshisatow/kqsea-streaming.git`

## Running the hivemind client

> `[stream@kq-stream-1]$ npx @kqhivemind/hivemind-client ~/kqsea-streaming/cab_configs/config-4bs.json`