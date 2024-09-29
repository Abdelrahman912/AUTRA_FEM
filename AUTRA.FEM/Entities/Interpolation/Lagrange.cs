using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.Interpolation
{
    public abstract class Lagrange
    {
        public abstract List<double> ShapeValues(GaussPoint gaussPoint);
        public abstract List<Vector2D> ShapeDerivatives(GaussPoint gaussPoint);
    }
}
