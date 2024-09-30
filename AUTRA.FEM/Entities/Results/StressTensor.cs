using AUTRA.FEM.Entities.NumericalIntegration;
using MathNet.Numerics.LinearAlgebra;
using System.Text;

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

        #region Methods

        public override string ToString()
        {
            var str = new StringBuilder();
            str.AppendLine($"Gauss Point: {GaussPoint}");
            str.AppendLine("Stress Tensor:");
            str.AppendLine($"σ11: {Vogit[0]}");
            str.AppendLine($"σ22: {Vogit[1]}");
            str.AppendLine($"σ12: {Vogit[2]}");
            return str.ToString();
        }

        #endregion
    }
}
