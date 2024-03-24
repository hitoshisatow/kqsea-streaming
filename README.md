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

Modify MVNe drive to remove existing Windows partitions

> `root@archiso ~ # fdisk /dev/nvme0n1`

Leave existing EFI System partition (/dev/nvme0n1p1) and remove any Windows partitions. Add new partition that takes remaining space. It should default to Linux filesystem type. Write changes and exit

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
> `[root@archiso /]# hwclock --systohc`

#### Localization

Edit `/etc/locale.gen` and uncomment `en_US.UTF-8`

> `[root@archiso /]# locale-gen`

Create `/etc/locale.confg` with the following contents

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

#### Install streaming applications

> `[root@archiso /]# pacman -S gnome networkmanager libva-mesa-driver vlc`

Select all selections for gnome

Select 1) noto-fonts-emoji for emoji-font

Select 2) pipewire-jack for jack

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