Vagrant.configure("2") do |config|
  config.vm.define "default", primary: true, autostart: true do |cfg|
    cfg.vm.provider "virtualbox" do |v|
      v.memory = 4096
      v.cpus = 2
    end
    cfg.vm.box = "bento/ubuntu-20.04"
    cfg.ssh.forward_agent = true
    cfg.vm.network :private_network, ip: "10.0.254.100"
    cfg.vm.synced_folder ".", "/home/vagrant/nbproject/", :nfs => true
    cfg.vm.provision :shell, :path => "vagrant_provision.sh"
    cfg.vm.network :forwarded_port, guest: 8081, host: 8081
    cfg.vm.network :forwarded_port, guest: 80, host: 8080
  end
end
