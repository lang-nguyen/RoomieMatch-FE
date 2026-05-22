import Header from '../features/homepage/components/Header';
import Footer from '../features/homepage/components/Footer';

const FindMatePage = () => {
  return (
    <div className="homepage">
      <Header initialActiveId="find-mate" />
      <main className="main-content">
        <div className="content-container" style={{ paddingTop: '40px' }}>
          <div className="left-column">
            <section className="section">
              <h2 className="section-title">Tinh nang tim ban dang duoc hoan thien</h2>
              <p className="section-subtitle">Vui long quay lai sau.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindMatePage;
