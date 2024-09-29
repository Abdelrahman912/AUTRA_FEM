using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Spatial.Euclidean;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.FEValues
{
    public class GPFEValues
    {
        #region Properties
        public GaussPoint  GaussPoint { get; }
        public List<double> N { get; }
        public List<Vector2D> dNdXi { get; }
        #endregion

        #region Constructors
        public GPFEValues(GaussPoint gaussPoint, List<double> shapeValues, List<Vector2D> shapeDerivatives)
        {
            GaussPoint = gaussPoint;
            N = shapeValues;
            dNdXi = shapeDerivatives;
        }
        #endregion
    }
}
