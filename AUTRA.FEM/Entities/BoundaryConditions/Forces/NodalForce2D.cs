using MathNet.Spatial.Euclidean;
using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.BoundaryConditions.Forces
{
    public  class NodalForce2D: NodalForce
    {
        public Vector2D Components { get; }



        public NodalForce2D(double fx, double fy)
        {
            Components = new Vector2D(fx, fy);
        }

        public NodalForce2D()
        {
            Components = new Vector2D(0, 0);
        }

        public override string ToString()
        {
            var Fx = Components.X;
            var Fy = Components.Y;
            return $"Fx: {Fx}, Fy: {Fy}";
        }
    }
}
