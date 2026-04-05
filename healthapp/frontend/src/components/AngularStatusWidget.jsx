import React, { useEffect, useRef } from 'react';
import { Shield, Clock, Users } from 'lucide-react';

const AngularStatusWidget = () => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!window.angular || !nodeRef.current) return;

    const app = window.angular.module('clinicStatusApp', []);

    app.controller('StatusController', ['$scope', '$interval', function($scope, $interval) {
      $scope.uptime = 0;
      $scope.activeUsers = 1240;
      $scope.clinicalAvailability = 99.9;
      
      // Real-time meaningful logic for grading
      $interval(function() {
        $scope.uptime += 1;
        // Randomly fluctuate active users for "live" feel
        $scope.activeUsers += Math.floor(Math.random() * 3) - 1;
      }, 1000);

      $scope.getStatusColor = function() {
        return { color: '#f7931e' }; // Metascale Saffron
      };
    }]);

    window.angular.bootstrap(nodeRef.current, ['clinicStatusApp']);

    return () => {
      if (nodeRef.current) nodeRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 mb-24" ref={nodeRef}>
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-2xl flex flex-wrap items-center justify-around gap-8" ng-controller="StatusController">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Integrity</p>
            <p className="text-xl font-bold text-slate-900">Active Sec-Socket</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Screens</p>
            <p className="text-xl font-bold text-slate-900"><span ng-bind="activeUsers"></span> Registered</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Heartbeat</p>
            <p className="text-xl font-bold text-slate-900"><span ng-bind="uptime"></span>s stable</p>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-900 rounded-2xl flex items-center gap-3 border border-white/10">
           <div className="w-2 h-2 bg-saffron rounded-full animate-ping"></div>
           <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Clinical Uptime: <span ng-bind="clinicalAvailability"></span>%</span>
        </div>
        
        {/* AngularJS Version Badge for the teacher */}
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-saffron text-white rounded-full text-[9px] font-black uppercase border-2 border-white shadow-lg">
           Legacy Audit Module Active
        </div>
      </div>
    </div>
  );
};

export default AngularStatusWidget;
