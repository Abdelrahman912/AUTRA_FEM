using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Numerics.LinearAlgebra;

namespace AUTRA.FEM.Entities.Results
{
    public class StressTensor
    {
        
        #region Properties
        public GaussPoint GaussPoint { get; }
        public Vector<double> Vogit { get;  }
        #endregion

        #region Constructors
        public StressTensor(GaussPoint gaussPoint, Vector<double> vogit)
        {
            GaussPoint = gaussPoint;
            Vogit = vogit;
        }
        #endregion
    }
}
