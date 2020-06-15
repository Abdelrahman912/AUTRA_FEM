﻿using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.Design
{
    public interface ICodeDesigner
    {
        bool DesignBeam(Section section, double span, double luact, BeamType beamType, double WLL, double Vd, double Md, DesignResult result);
        bool DesignBeam(Group group, BeamType beamType);
        bool DesignColumn(Section section, double length, BracingCondition bracing, double Nd, DesignResult designResult);
        bool DesignColumn(Group group, BracingCondition bracing);
        SimpleConnection DesignSimpleConnection(double vd, Bolt bolt, Section section,ref int weldSize,ref int plateThickness);
    }


}