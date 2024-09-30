using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Spatial.Euclidean;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.Interpolation
{
    public class BiquadraticLagrange : Lagrange
    {
        public override List<Vector2D> ShapeDerivatives(GaussPoint gaussPoint)
        {
            var xi1 = gaussPoint.Xi1;
            var xi2 = gaussPoint.Xi2;
            var shapeDerivatives = new List<Vector2D>
            {
                // Corner
               new Vector2D(0.25 * (1- 2 * xi1) * (1- xi2) * xi2 , 0.25 * xi1 * (1-xi1) * (1-2*xi2)),
               new Vector2D(-0.25 * (1+ 2 * xi1) * (1- xi2) * xi2 , -0.25 * xi1 * (1+xi1) * (1-2*xi2)),
               new Vector2D(0.25 * (1+ 2 * xi1) * (1+ xi2) * xi2 , 0.25 * xi1 * (1+xi1) * (1+2*xi2)),
               new Vector2D(-0.25 * (1- 2 * xi1) * (1+ xi2) * xi2 , -0.25 * xi1 * (1-xi1) * (1+2*xi2)),
               // Edge
               new Vector2D(xi1 * xi2 * (1-xi2), -0.5 * (1-xi1*xi1) * (1-2*xi2)),
               new Vector2D(0.5 * (1-xi2*xi2) * (1+2*xi1), -xi1 * xi2 * (1+xi1)),
               new Vector2D(-xi1 * xi2 * (1+xi2), 0.5 * (1-xi1*xi1) * (1+2*xi2)),
               new Vector2D(-0.5 * (1-xi2*xi2) * (1-2*xi1), xi1 * xi2 * (1-xi1)),
               // Bubble
               new Vector2D(-2*xi1 * (1- xi1* xi1), -2* xi2 * (1-xi1 * xi1)) 
            };
            return shapeDerivatives;
        }

        public override List<double> ShapeValues(GaussPoint gaussPoint)
        {
            var xi1 = gaussPoint.Xi1;
            var xi2 = gaussPoint.Xi2;
            var shapeValues = new List<double>
            {
                0.25 * xi1 * xi2 * (1-xi1) * (1-xi2),
                -0.25 * xi1 * xi2 * (1+xi1) * (1-xi2),
                0.25 * xi1 * xi2 * (1+xi1) * (1+xi2),
                -0.25 * xi1 * xi2 * (1-xi1) * (1+xi2),
                0.5 * (1-xi1 * xi1)* (xi2 - 1) * xi2,
                0.5 * (1-xi2 * xi2)* (xi1 + 1) * xi1,
                0.5 * (1-xi1 * xi1)* (xi2 + 1) * xi2,
                0.5 * (1-xi2 * xi2)* (xi1 - 1) * xi1,
                (1-xi1 * xi1) * (1-xi2 * xi2)
            };
            return shapeValues;
        }
    }
}
