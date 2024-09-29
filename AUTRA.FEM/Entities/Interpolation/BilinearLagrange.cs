using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Spatial.Euclidean;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.Interpolation
{
    public  class BilinearLagrange : Lagrange
    {
        #region Methods
        public override List<double> ShapeValues(GaussPoint gaussPoint)
        {
            var ksi = gaussPoint.Xi1;
            var eta = gaussPoint.Xi2;
            var shapeValues = new List<double>
            {
                0.25 * (1 - ksi) * (1 - eta),
                0.25 * (1 + ksi) * (1 - eta),
                0.25 * (1 + ksi) * (1 + eta),
                0.25 * (1 - ksi) * (1 + eta)
            };
            return shapeValues;
        }

        public override List<Vector2D> ShapeDerivatives(GaussPoint gaussPoint)
        {
            var ksi = gaussPoint.Xi1;
            var eta = gaussPoint.Xi2;
            var shapeDerivatives = new List<Vector2D>
            {
                new Vector2D(-0.25 * (1 - eta), -0.25 * (1 - ksi)),
                new Vector2D(0.25 * (1 - eta), -0.25 * (1 + ksi)),
                new Vector2D(0.25 * (1 + eta), 0.25 * (1 + ksi)),
                new Vector2D(-0.25 * (1 + eta), 0.25 * (1 - ksi))
            };
            return shapeDerivatives;
        }

        #endregion
    }
}
