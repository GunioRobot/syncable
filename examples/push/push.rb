require 'rubygems'
require 'pusher'

Pusher.app_id = 2192
Pusher.app_id = '2192'
Pusher.key = 'c4d8da3b6c36091f0ac4'
Pusher.secret = '50d3a48cd3e7133e7f55'

Pusher['test_channel'].trigger('my_event', {:user => 'pablo', :state => "happy", :id => 1})
sleep 1
Pusher['test_channel'].trigger('my_event', {:user => 'luis', :state => "sad", :id => 2})
sleep 1
Pusher['test_channel'].trigger('my_event', {:user => 'ana', :state => "tall", :id => 3})
sleep 1
Pusher['test_channel'].trigger('my_event', {:user => 'ana', :state => "cool", :id => 3})
sleep 1
Pusher['test_channel'].trigger('my_event', {:id => 1, :_action => "unset"})
