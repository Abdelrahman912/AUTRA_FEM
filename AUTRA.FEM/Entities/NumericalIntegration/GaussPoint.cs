namespace AUTRA.FEM.Entities.NumericalIntegration
{
    public class GaussPoint
    {
        #region Properties
        public double Xi1 { get;}
        public double Xi2 { get; }
        public double W1 { get; }
        public double W2 { get; }
        #endregion

        #region Constructors
        public GaussPoint(double xi1, double xi2, double w1, double w2)
        {
            Xi1 = xi1;
            Xi2 = xi2;
            W1 = w1;
            W2 = w2;
        }
        #endregion
    }
}
